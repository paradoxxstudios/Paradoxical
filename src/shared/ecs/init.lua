local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")

local Matter = require(ReplicatedStorage.Packages.matter)
local Plasma = require(ReplicatedStorage.Packages.plasma)

local Host = require(script.hosts)
local State = require(script.state)
local Model = require(script.components).Model
local System = require(script.systems)

local MAX_DISPLAY_ORDER = 2147483647
local GROUP_ID = 32887154
local DEBUG_RANK = 251

local connections: {string: RBXScriptConnection} = nil

--[=[
    @class ECS

    The ECS class.
]=]
local ECS = {}

--[=[
    @function Authorize
    @within ECS

    @param player Player -- A [Player] reference
    @return boolean

    Authorizes a player to view debugger if higher than the DEBUG_RANK
]=]
function ECS.Authorize(player: Player): boolean
    return RunService.IsStudio() or player:GetRankInGroup(GROUP_ID) >= DEBUG_RANK
end

--[=[
    Starts the ECS.

    @method Start
    @within ECS

    @param host number -- The host the ECS is running on
    @return World -- The matter World
    @return State -- The global ECS state of the ECS

    @error "ECS already running." -- This is thrown when the ECS has already started.
]=]
function ECS:Start(host: Host.Host)
    if connections then error("ECS already running.") end

    local state = State.new()
    local world = Matter.World.new()
    local debug = Matter.Debugger.new(Plasma)
    debug.authorize = self.Authorize

    debug.findInstanceFromEntity = function(id)
        if not world:contains(id) then return end
        local model = world:get(id, Model)
        return model and model.model or nil
    end

    local loop = Matter.Loop.new(world, state, debug:getWidgets())
    System:Start(host, loop, debug)
    debug:autoInitialize(loop)

    connections = loop:begin({
        defualt = RunService.Heartbeat,
        Stepped = RunService.Stepped
    })

    if host == Host.All or host == Host.Server then
        
    end
end

return ECS