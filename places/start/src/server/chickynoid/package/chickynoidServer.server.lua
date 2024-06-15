local ServerStorage = game:GetService("ServerStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local ReplicatedFirst = game:GetService("ReplicatedFirst")

local Packages = game.ServerScriptService.chickynoid.package
local ServerModule = require(Packages.serverModule)
local ServerMods = require(Packages.serverMods)

ServerModule:RecreateCollisions(workspace:FindFirstChild("gameArea"))

ServerMods:RegisterMods("servermods", game.ServerScriptService.chickynoid.mods)
ServerMods:RegisterMods("characters", game.ReplicatedFirst.chickynoid.characters)
ServerMods:RegisterMods("weapons", game.ReplicatedFirst.chickynoid.weapons)

ServerModule:Setup()

-- -- bots? 
-- local Bots = require(script.Parent.Bots)
-- Bots:MakeBots(ServerModule,100)