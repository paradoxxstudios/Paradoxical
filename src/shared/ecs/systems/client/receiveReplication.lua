local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Packages = ReplicatedStorage.Packages

local Matter = require(Packages.matter)
local components = require(ReplicatedStorage.paradoxical.ecs.components)
local State = require(ReplicatedStorage.paradoxical.ecs.state)
local routes = require(ReplicatedStorage.paradoxical.ecs.routes)

local DEBUG_SPAWN = "Spawn %ds%d with %s"
local DEBUG_DESPAWN = "Despawn %ds%d"
local DEBUG_MODIFY = "Modify %ds%d adding %s, removing %s"

--[=[
    @function receiveReplication
    @within SystemClient

    @param world World
    @param state StateType

    Starts the replication receiver.
]=]
local function receiveReplication(world: Matter.World, state: State.StateType)
    local function debugPrint(message: string, ...: string | number)
        if state.debugEnabled then
            print("ECS Replication>", string.format(message, ...))
        end
    end

    local serverToClientEntity = {}

    for _, _, entites in routes.MatterReplication:query() do
        for serverId, componentMap in entites do
            local clientId = serverToClientEntity[serverId]

            if clientId and next(componentMap) == nil then
                world:despawn(clientId)
                serverToClientEntity[serverId] = nil
                debugPrint(DEBUG_DESPAWN, clientId, serverId)
                continue
            end

            local componentsToInsert = {}
            local componentsToRemove = {}
            local insertNames = {}
            local removeNames = {}

            for name, container in componentMap do
                local component = components[name]
                if container.data then
                    table.insert(componentsToInsert, component(container.data))
                    table.insert(insertNames, name)
                else
                    table.insert(componentsToRemove, component)
                    table.insert(removeNames, name)
                end
            end

            if clientId == nil then
                local clientId = world:spawn(unpack(componentsToInsert))
                serverToClientEntity[serverId] = clientId
                debugPrint(DEBUG_SPAWN, clientId, serverId, table.concat(insertNames, ", "))
            else
                if #componentsToInsert > 0 then
                    world:insert(clientId, unpack(componentsToInsert))
                end

                if #componentsToRemove > 0 then
                    world:remove(clientId, unpack(componentsToRemove))
                end

                debugPrint(DEBUG_MODIFY,
                    clientId,
                    serverId,
                    if #insertNames > 0 then table.concat(insertNames, ", ") else "nothing",
                    if #removeNames > 0 then table.concat(removeNames, ", ") else "nothing"
                )
            end
        end
    end
end

return {
    system = receiveReplication,
    priority = 1
}