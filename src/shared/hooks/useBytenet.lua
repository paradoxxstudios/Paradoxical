local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Matter = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "matter", "lib")

local function useBytenet(id, packet) 
    local storage = Matter.useHookState(id)

    if storage.id == nil then
        storage.queue = {}
        storage.id = id
        
        packet.listen(function(data, player)
            table.insert(storage.queue, table.pack(data, player))
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

return useBytenet
