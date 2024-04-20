--[=[
	@prop Tags Tags
	@within ECS

	The [Tags] class.
]=]

local CollectionService = game:GetService("CollectionService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local components = require(ReplicatedStorage.paradoxical.ecs.components)
local IdAttribute = require(ReplicatedStorage.paradoxical.ecs.idAttribute)

local connections: {RBXScriptSignal} = {}

--[=[
	@class Tags

	A class for handling [CollectionService] tags.
]=]
local Tags = {}

--[=[
	@method Start
	@within Tags

	@param world World -- The world to spawn components in
	@param bound [string: Component] -- A map of bound tags

	Warns when spawnBound function instance parameter is a [Model] and
	does not have a primary part or when instance is not a [Model] or [BasePart].

	Spawns a new entity with a [Model] and [Transform] component and
	sets its [IdAttribute.idAttribute] to entity id.

	It then listens for every instance that has bounded tags and executes the function above.
	Despawns the entity when tag is removed.
]=]
function Tags:Start(world, bound)
	local function spawnBound(instance: Instance, component)
		local primaryPart: BasePart = nil
		if instance:IsA("Model") then
			if instance.PrimaryPart then
				primaryPart = instance.PrimaryPart
			else
				warn("Attempted to tag a model that has no primary part:", instance)
				return
			end
		elseif instance:IsA("BasePart") then
			primaryPart = instance
		else
			warn("Attempted to tag an instance that is not a Model or BasePart:", instance)
			return
		end

		local id = world:spawn(
			component(),
			components.Model({
				model = instance,
			}),
			components.Transform({
				cframe = primaryPart.CFrame,
			})
		)

		instance:SetAttribute(IdAttribute:getIdAttribute(), id)
	end

	for tagName, component in bound do
		for _, instance in ipairs(CollectionService:GetTagged(tagName)) do
			spawnBound(instance, component)
		end

		table.insert(
			connections,
			CollectionService:GetInstanceAddedSignal(tagName):Connect(function(instance)
				spawnBound(instance, component)
			end)
		)

		CollectionService:GetInstanceRemovedSignal(tagName):Connect(function(instance)
			local id = instance:GetAttribute(IdAttribute:getIdAttribute())
			if typeof(id) == "number" then
				world:despawn(id)
			end
		end)
	end
end

--[=[
	@method Stop
	@within Tags

	Stops spawning bound tags.
]=]
function Tags:Stop()
	for _, connection in connections do
		connection:Disconnect()
	end
	table.clear(connections)
end

return Tags