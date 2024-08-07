local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local StarterPlayer = game:GetService("StarterPlayer")

require(ReplicatedStorage.rbxts_include.node_modules["@rbxts"].testez).TestBootstrap:run({
	ReplicatedStorage.paradoxical,
    ServerScriptService.paradoxical,
    StarterPlayer.StarterPlayerScripts.paradoxical
})