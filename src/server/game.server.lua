local ReplicatedStorage = game:GetService("ReplicatedStorage")

local ecs = ReplicatedStorage.paradoxical.ecs
local ECS = require(ecs)
local Host = require(ecs.hosts)
local IdAttribute = require(ecs.idAttribute)

local HOST = Host.Server

IdAttribute:setEnviorment(HOST)
ECS:Start(HOST)