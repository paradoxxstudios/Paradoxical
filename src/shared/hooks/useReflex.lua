local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Matter = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "matter", "lib")

local function useReflex<T>(id, producer, selector) 
    local storage = Matter.useHookState(id)

    if storage.event == nil then
        storage.queue = {}

        storage.event = producer:subscribe(selector, function(current, previous)
            table.insert(storage.queue, table.pack(current, previous))
        end)
    end

    local index = 0
    return function() 
        index += 1

        local args = storage.queue[1]
        table.remove(storage.queue, 1)

        if args then
            return index, unpack(args, 1, args.n)
        end
    end
end

return useReflex
