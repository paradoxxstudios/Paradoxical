-- Compiled with roblox-ts v1.3.3
local TS = _G[script]
local HttpService = game:GetService("HttpService")
local runService = game:GetService("RunService")
local collectionService = game:GetService("CollectionService")
-- * @internal
local NAMESPACE_SEPARATOR = "/"
-- * @internal
local NAMESPACE_ROOT = "@"
-- * @internal
local IS_SERVER = not runService:IsRunning() or runService:IsServer()
-- * @internal
local IS_CLIENT = runService:IsRunning() and runService:IsClient()
local IS_RUNNING = runService:IsRunning()
-- * @internal
local MAX_CLIENT_WAITFORCHILD_TIMEOUT = 10
-- * @internal
local function getGlobalRemote(name)
	return ":\\" .. name
end
-- * @internal
local function isLuaTable(value)
	return type(value) == "table"
end
-- * @internal
local NetMiddlewareEvent
do
	NetMiddlewareEvent = setmetatable({}, {
		__tostring = function()
			return "NetMiddlewareEvent"
		end,
	})
	NetMiddlewareEvent.__index = NetMiddlewareEvent
	function NetMiddlewareEvent.new(...)
		local self = setmetatable({}, NetMiddlewareEvent)
		return self:constructor(...) or self
	end
	function NetMiddlewareEvent:constructor(netInstance)
		self.netInstance = netInstance
	end
	function NetMiddlewareEvent:GetInstance()
		return self.netInstance:GetInstance()
	end
end
local REMOTES_FOLDER_NAME = "_NetManaged"
-- * @internal
-- * @internal
local ServerTickFunctions = {}
-- * @internal
local function findOrCreateFolder(parent, name)
	local folder = parent:FindFirstChild(name)
	if folder then
		return folder
	else
		folder = Instance.new("Folder", parent)
		folder.Name = name
		return folder
	end
end
-- const dist = $env<"TS" | "Luau" | "TestTS">("TYPE", "TS");
local location = script.Parent
local _ = nil
local _1 = nil
local remoteFolder = findOrCreateFolder(location, REMOTES_FOLDER_NAME)
--[[
	*
	* Errors with variables formatted in a message
	* @param message The message
	* @param vars variables to pass to the error message
]]
local function errorft(message, vars)
	-- eslint-disable-next-line @typescript-eslint/ban-ts-comment
	-- @ts-ignore
	local _arg1 = function(token)
		local _condition = vars[token]
		if _condition == nil then
			_condition = token
		end
		return _condition
	end
	message = string.gsub(message, "{([%w_][%w%d_]*)}", _arg1)
	error(message, 2)
end
local traceSet = {}
local function warnOnce(message)
	local trace = debug.traceback()
	if traceSet[trace] ~= nil then
		return nil
	end
	traceSet[trace] = true
	warn("[rbx-net] " .. message)
end
local function format(message, vars)
	-- eslint-disable-next-line @typescript-eslint/ban-ts-comment
	-- @ts-ignore
	local _arg1 = function(token)
		local _condition = vars[token]
		if _condition == nil then
			_condition = token
		end
		return _condition
	end
	message = string.gsub(message, "{([%w_][%w%d_]*)}", _arg1)
	return message
end
-- * @internal
local findRemote, getTagFromRemoteType
local function waitForRemote(remoteType, name, timeout)
	return TS.Promise.defer(function(resolve, reject)
		-- First, check if remote already exists
		local result = findRemote(remoteType, name)
		if result then
			resolve(result)
			return nil
		end
		-- If not, wait for remote
		local searchStart = os.clock()
		local remote = remoteFolder:WaitForChild(name, timeout)
		local remoteTypeTag = getTagFromRemoteType(remoteType)
		if remote and table.find(collectionService:GetTags(remote), remoteTypeTag) ~= nil then
			resolve(remote)
			return nil
		end
		-- If result is not correct remote type, poll until correct remote is added
		local elapsed = os.clock() - searchStart
		while elapsed < timeout do
			elapsed += (runService.Heartbeat:Wait())
			result = findRemote(remoteType, name)
			if result then
				resolve(result)
				return nil
			end
		end
		reject("Timed out while waiting for " .. (remoteType .. (" '" .. (name .. ("' after " .. (tostring(elapsed) .. " seconds."))))))
	end)
end
-- * @internal
function findRemote(remoteType, name)
	local tag = getTagFromRemoteType(remoteType)
	local _exp = collectionService:GetTagged(tag)
	local _arg0 = function(f)
		return f.Name == name
	end
	-- ▼ ReadonlyArray.find ▼
	local _result
	for _i, _v in ipairs(_exp) do
		if _arg0(_v, _i - 1, _exp) == true then
			_result = _v
			break
		end
	end
	-- ▲ ReadonlyArray.find ▲
	return _result
end
-- * @internal
function getTagFromRemoteType(remoteType)
	repeat
		if remoteType == "AsyncRemoteFunction" then
			return "NetManagedAsyncFunction"
		end
		if remoteType == "RemoteEvent" then
			return "NetManagedEvent"
		end
		if remoteType == "RemoteFunction" then
			return "NetManagedLegacyFunction"
		end
	until true
	error("Invalid Remote Access")
end
-- * @internal
local function getRemoteOrThrow(remoteType, name)
	local existing = findRemote(remoteType, name)
	if existing then
		return existing
	else
		error("Could not find Remote of type " .. (remoteType .. (' called "' .. (name .. '"'))))
	end
end
-- * @internal
local function findOrCreateRemote(remoteType, name, onCreate)
	local existing = findRemote(remoteType, name)
	if existing then
		if collectionService:HasTag(existing, "NetDefinitionManaged") then
			warnOnce("Fetching " .. (remoteType .. (" '" .. (name .. "', which is a DefinitionsManaged instance from a non-definitions context. This is considered unsafe."))))
		end
		return existing
	else
		if not IS_SERVER then
			error("Creation of Events or Functions must be done on server!")
		end
		local remote
		if remoteType == "RemoteEvent" then
			remote = Instance.new("RemoteEvent")
			collectionService:AddTag(remote, "NetManagedEvent")
		elseif remoteType == "AsyncRemoteFunction" then
			remote = Instance.new("RemoteEvent")
			collectionService:AddTag(remote, "NetManagedAsyncFunction")
		elseif remoteType == "RemoteFunction" then
			remote = Instance.new("RemoteFunction")
			collectionService:AddTag(remote, "NetManagedLegacyFunction")
		else
			error("Invalid Remote Type: " .. remoteType)
		end
		remote.Name = name
		remote.Parent = remoteFolder
		local _2 = nil
		local _3 = nil
		local _result = onCreate
		if _result ~= nil then
			_result(remote)
		end
		return remote
	end
end
-- * @internal
local function checkArguments(types, args)
	if args == nil then
		warn("[net-types] Argument length is zero")
		return false
	end
	do
		local i = 0
		local _shouldIncrement = false
		while true do
			if _shouldIncrement then
				i += 1
			else
				_shouldIncrement = true
			end
			if not (i < #types) then
				break
			end
			local typeCheck = types[i + 1]
			local value = args[i + 1]
			if not typeCheck(value) then
				warn("[net-types] Argument at index " .. (tostring(i) .. " was invalid type."))
				return false
			end
		end
	end
	return true
end
if IS_SERVER then
	game:GetService("RunService").Stepped:Connect(function(time, step)
		for _2, f in ipairs(ServerTickFunctions) do
			f()
		end
	end)
end
return {
	getGlobalRemote = getGlobalRemote,
	isLuaTable = isLuaTable,
	findOrCreateFolder = findOrCreateFolder,
	errorft = errorft,
	warnOnce = warnOnce,
	format = format,
	waitForRemote = waitForRemote,
	findRemote = findRemote,
	getTagFromRemoteType = getTagFromRemoteType,
	getRemoteOrThrow = getRemoteOrThrow,
	findOrCreateRemote = findOrCreateRemote,
	checkArguments = checkArguments,
	NAMESPACE_SEPARATOR = NAMESPACE_SEPARATOR,
	NAMESPACE_ROOT = NAMESPACE_ROOT,
	IS_SERVER = IS_SERVER,
	IS_CLIENT = IS_CLIENT,
	IS_RUNNING = IS_RUNNING,
	MAX_CLIENT_WAITFORCHILD_TIMEOUT = MAX_CLIENT_WAITFORCHILD_TIMEOUT,
	NetMiddlewareEvent = NetMiddlewareEvent,
	ServerTickFunctions = ServerTickFunctions,
}
