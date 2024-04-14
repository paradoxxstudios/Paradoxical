local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")

require(ReplicatedStorage.testez).TestBootstrap:run({
	ReplicatedStorage.Paradoxical.tests,
    --ServerScriptService.Paradoxical,
})