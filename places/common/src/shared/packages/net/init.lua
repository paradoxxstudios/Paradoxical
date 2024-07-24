-- Compiled with roblox-ts v1.3.3
local TS = _G[script]
local NetServerContext = TS.import(script, script, "server")
local NetClientContext = TS.import(script, script, "client")
local NetDefinitions = TS.import(script, script, "definitions").default
local NetMiddleware = TS.import(script, script, "middleware").NetMiddleware
--[[
	*
	* Networking Library for Roblox
	* @version 3.0
]]
local Net = {}
do
	local _container = Net
	--[[
		*
		* Legacy client API for Net
		* @deprecated
	]]
	local Client = NetClientContext
	_container.Client = Client
	--[[
		*
		* Legacy server API for Net
		* @deprecated
	]]
	local Server = NetServerContext
	_container.Server = Server
	--[[
		*
		* The definitions API for Net
	]]
	local Definitions = NetDefinitions
	_container.Definitions = Definitions
	--[[
		*
		* Utility types for Net
	]]
	local DIST = "TS"
	_container.DIST = DIST
	--[[
		*
		* The version of RbxNet
	]]
	local VERSION = "3.0.9"
	_container.VERSION = VERSION
	--[[
		*
		* Built-in middlewares
	]]
	local Middleware = NetMiddleware
	_container.Middleware = Middleware
	--[[
		*
		* Middleware function type for Net
	]]
	--[[
		*
		* Short-hand for `Net.Definitions.Create`
		* @see {@link Definitions.Create}
	]]
	local function CreateDefinitions(declarations, configuration)
		return Definitions.Create(declarations, configuration)
	end
	_container.CreateDefinitions = CreateDefinitions
end
local _ = nil
local _1 = nil
return Net
