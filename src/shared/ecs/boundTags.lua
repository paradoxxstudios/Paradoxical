local ReplicatedStorage = game:GetService("ReplicatedStorage")

local components = require(ReplicatedStorage.paradoxical.ecs.components)

--[=[
    @prop boundTags [string: Component]
    @within Tags

    A map of tags to their bound components.
    - Test
]=]
return {
    ["Test"] = components.Test;
}