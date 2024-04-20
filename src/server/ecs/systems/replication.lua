local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local components = require(ReplicatedStorage.paradoxical.ecs.components)
local routes = require(ReplicatedStorage.paradoxical.ecs.routes)
local useEvent = require(ReplicatedStorage.Packages.matter).useEvent

local REPLICATED_COMPONENTS = {
	"Model",
	"Health",
}

local replicatedComponents = {}

for _, name in REPLICATED_COMPONENTS do
	replicatedComponents[components[name]] = true
end

--[=[
    @function replication
    @within SystemServer

    Server replication to client.

    Replicated components:
    - [Model]
    - [Health]
]=]
local function replication(world)
	for _, player in useEvent(Players, "PlayerAdded") do
		local payload = {}

		for entityId, entityData in world do
			local entityPayload = {}
			payload[tostring(entityId)] = entityPayload

			for component, componentData in entityData do
				if replicatedComponents[component] then
					entityPayload[tostring(component)] = { data = componentData }
				end
			end
		end

		print("Sending initial payload to", player)
		routes.MatterReplication:send(payload):to(player)
	end

	local changes = {}

	for component in replicatedComponents do
		for entityId, record in world:queryChanged(component) do
			local key = tostring(entityId)
			local name = tostring(component)

			if changes[key] == nil then
				changes[key] = {}
			end

			if world:contains(entityId) then
				changes[key][name] = { data = record.new }
			end
		end
	end

	if next(changes) then
		routes.MatterReplication:send(changes)
	end
end

return {
	system = replication,
	priority = math.huge,
}