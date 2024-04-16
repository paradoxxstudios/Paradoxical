local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")

local Matter = require(ReplicatedStorage.Packages.matter)
local Plasma = require(ReplicatedStorage.Packages.plasma)

local Host = require(script.hosts)

--[=[
    @class ECS

    The ECS class.
]=]
local ECS = {}

function ECS:Start(host: Host.Host)
    
end

return ECS