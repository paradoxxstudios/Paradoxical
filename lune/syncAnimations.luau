local fs = require("@lune/fs" :: string)
local process = require("@lune/process" :: string)
local roblox = require("@lune/roblox" :: string)

local placeFile = process.args[1] .. ".rbxl"

assert(table.find(fs.readDir("mantle/places"), placeFile), "File [" .. placeFile .. "] does not exist.")

local placeFilePath = "mantle/places/" .. placeFile
print("Getting roblox file:", placeFilePath, "\n")
local file = fs.readFile(placeFilePath)

local game = roblox.deserializePlace(file)
local R6Rig = game:GetService("ReplicatedFirst").common.chickynoid.package.assets.R6Rig

local modelFile = roblox.serializeModel({R6Rig})
fs.writeFile("places/common/src/first/chickynoid/package/assets/R6Rig.rbxm", modelFile)

for _, animation in R6Rig.Humanoid.Animator:GetChildren() do
    print(animation.Name, "-", animation.AnimationId)
end

print("\nFinished sycning animations")