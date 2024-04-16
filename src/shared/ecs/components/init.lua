local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Packages = ReplicatedStorage.Packages
local Component = require(Packages.matter).component
local COMPONENTS = require(script.types)

local components = {}

for _, name in ipairs(COMPONENTS.components) do
    components[name] = Component(name, COMPONENTS.defaults[name])
end

return components