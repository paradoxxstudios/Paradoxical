-- Compiled with roblox-ts v1.3.3
local TS = _G[script]
local AsyncFunction = TS.import(script, script, "ClientAsyncFunction").default
local Event = TS.import(script, script, "ClientEvent").default
local Function = TS.import(script, script, "ClientFunction").default
return {
	Event = Event,
	AsyncFunction = AsyncFunction,
	Function = Function,
}
