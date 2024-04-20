local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")

local Packages = ReplicatedStorage.Packages
local Matter = require(Packages.matter)
local HotReloader = require(Packages.rewire).HotReloader
local Host = require(ReplicatedStorage.paradoxical.ecs.hosts)

local ERROR_CONTAINER = "%s container not found"

local shared = script:FindFirstChild("shared")
local client = script:FindFirstChild("client")
local server = ServerScriptService:FindFirstChild("paradoxical")
        :FindFirstChild("ecs")
        :FindFirstChild("systems")

local firstRunSystems: {} | nil = {}
local hotReloader: typeof(HotReloader)

--[=[
    @class System

    A class for documenting systems.
]=]
local System = {}

--[=[
    Starts the system loader.

    Loads systems for the specified container into the provided loop and debugger.
    Systems are hot reloaded as they are changed.

    @method Start
    @within System
    @param container number -- The container to load
    @param loop Matter.Loop -- The ECS loop to load systems into
    @param debug Matter.Debugger -- The debugger to load systems into

    @error "[container] container not found" -- This is thrown when a container necessary for the provided host doesn't exist.
]=]
function System:Start(container: Host.Host, loop: typeof(Matter.Loop), debug: typeof(Matter.Debugger))
    if firstRunSystems == nil then return end

    local containers: {Instance} = {}
    if shared == nil then error(string.format(ERROR_CONTAINER, "Shared")) end
    table.insert(containers, shared)

    if container == Host.All or container == Host.Client then
        if client == nil then error(string.format(ERROR_CONTAINER, "Client")) end
        table.insert(containers, client)
    end

    if container == Host.All or container == Host.Server then
        if server == nil then error(string.format(ERROR_CONTAINER, "Server")) end
        table.insert(containers, server)
    end

    local systemsByModule: {ModuleScript: {}} = nil

    local function load(module: ModuleScript, context)
        local original = context.originalModule
        local previous = systemsByModule[original]
        local ok, required = pcall(require, module)

        if not ok then
            warn("Error when hot-reloading system", module.Name, required)
            return
        end

        local system = required

        if firstRunSystems then
            table.insert(firstRunSystems, system)
        elseif previous then
            loop:replaceSystem(previous, system)
            debug:replaceSystem(previous, system)
        else
            loop:scheduleSystem(system)
        end

        systemsByModule[original] = system
    end

    local function unload(_: ModuleScript, context) 
        if context.isReloading then return end
        
        local original = context.originalModule
        local previous = systemsByModule[original]
        if previous then
            loop:evictSystem(previous)
            systemsByModule[original] = nil
        end
    end

    hotReloader = HotReloader.new()
    for c in containers do
        hotReloader:scan(c, load, unload)
    end

    loop:scheduleSystems(firstRunSystems)
    firstRunSystems = nil
end

--[=[
    @method Stop
    @within System

    Stops loading systems.
]=]
function System:Stop()
    if firstRunSystems then return end
    firstRunSystems = {}
    if hotReloader then hotReloader:destroy() end
end

return System