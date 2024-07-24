local Packages = script.Parent.Parent
local ClientModule = require(Packages.client.clientModule)
local ClientMods = require(Packages.client.clientMods)

ClientMods:RegisterMods("clientmods", game.ReplicatedFirst.common.chickynoid.clientMods)
ClientMods:RegisterMods("characters", game.ReplicatedFirst.common.chickynoid.characters)
ClientMods:RegisterMods("weapons", game.ReplicatedFirst.common.chickynoid.weapons)
 
ClientModule:Setup()
