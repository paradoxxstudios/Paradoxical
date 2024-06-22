local fs = require("@lune/fs" :: string)
local process = require("@lune/process" :: string)
local roblox = require("@lune/roblox" :: string)

local placeFile = process.args[1] .. ".rbxlx"
if process.args[1] == "dev" then placeFile = "dev-" .. process.args[2] .. ".rbxlx" end

assert(table.find(fs.readDir("mantle/places"), placeFile), "File [" .. placeFile .. "] does not exist.")
assert(table.find(fs.readDir("places"), process.args[#process.args]), "Place [" .. process.args[#process.args] .. "] does not exist")

local placeFilePath = "mantle/places/" .. placeFile
print("Getting roblox file:", placeFilePath)
local file = fs.readFile(placeFilePath)
local game = roblox.deserializePlace(file)
local workspace = game:GetService("Workspace")
local gameArea = workspace.gameArea

local gameAreaPath = "places/" .. process.args[2] .. "/gameArea"
fs.removeDir(gameAreaPath)
fs.writeDir(gameAreaPath)

for _, child in gameArea:GetChildren() do
    print("Adding", child.Name)
    local childFile = roblox.serializeModel({ child })
    fs.writeFile(gameAreaPath .. "/" .. child.Name .. ".rbxm", childFile)
end

print("Finished syncing gameArea")