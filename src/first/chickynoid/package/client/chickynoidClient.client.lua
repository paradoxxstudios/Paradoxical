local Packages = game.ReplicatedFirst.chickynoid.package
local ClientModule = require(Packages.client.clientModule)
local ClientMods = require(Packages.client.clientMods)

ClientMods:RegisterMods("clientmods", game.ReplicatedFirst.chickynoid.clientMods)
ClientMods:RegisterMods("characters", game.ReplicatedFirst.chickynoid.characters)
ClientMods:RegisterMods("weapons", game.ReplicatedFirst.chickynoid.weapons)
 
ClientModule:Setup()
