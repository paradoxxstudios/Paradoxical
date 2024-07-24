local ServerStorage = game:GetService("ServerStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local ReplicatedFirst = game:GetService("ReplicatedFirst")

local Packages = game.ServerScriptService.common.chickynoid.package
local ServerModule = require(Packages.serverModule)
local ServerMods = require(Packages.serverMods)

ServerModule:RecreateCollisions(workspace:FindFirstChild("gameArea"))

ServerMods:RegisterMods("servermods", game.ServerScriptService.common.chickynoid.mods)
ServerMods:RegisterMods("characters", game.ReplicatedFirst.common.chickynoid.characters)
ServerMods:RegisterMods("weapons", game.ReplicatedFirst.common.chickynoid.weapons)

ServerModule:Setup()

-- -- bots? 
-- local Bots = require(script.Parent.Bots)
-- Bots:MakeBots(ServerModule,100)