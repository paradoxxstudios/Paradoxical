local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")

require(ReplicatedStorage.DevPackages.testez).TestBootstrap:run({
	ReplicatedStorage.Paradoxical.tests,
    ServerScriptService.Paradoxical,
})