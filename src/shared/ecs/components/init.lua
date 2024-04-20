local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Packages = ReplicatedStorage.Packages
local Component = require(Packages.matter).component
local COMPONENTS = require(script.types)

--[=[
    @prop Components Components
    @within ECS

    A class for ECS components.
]=]
local components = nil

for _, name in ipairs(COMPONENTS.components) do
    components[name] = Component(name, COMPONENTS.defaults[name])
end

-- A test component for bound tags.
-- This shouldn't be used and should be removed later.
components["Test"] = Component("Test")

return components