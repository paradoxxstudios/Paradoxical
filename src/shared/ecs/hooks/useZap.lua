--!strict
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Matter = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "matter", "lib")

type ZapEvent<T, U> = { on: ((T?, U?) -> ()) -> () }

--[[
Does not have discrim, thus will not "clean up" when not called.
Matter code will retain zap types will used.
Example usage:
```
for id, player, data in useZap(network.myCoolEvent) do
```
]]
local function useZap<T, U>(zapEvent: ZapEvent<T, U>)
	local storage = Matter.useHookState(zapEvent, function(storage) end) :: { queue: {}, event: ZapEvent<T, U> }

	if storage.event == nil then
		local queue = {}
		storage.queue = queue
		storage.event = zapEvent

		zapEvent.on(function(a, b)
			table.insert(queue, table.pack(a, b))
		end)
	end

	local index = 0
	return function(): (number, T, U)
		index += 1

		local arguments = storage.queue[1]
		table.remove(storage.queue, 1)

		if arguments then
			return index, unpack(arguments, 1, arguments.n)
		end
	end
end

return useZap