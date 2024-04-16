--[=[
    @interface Host
    @within System
    .None 1 -- Represents properties of no particular host.
    .Client 2 -- Represents properties of the client.
    .Server 3 -- Represents properties of the server.
    .All 4 -- Represents properties of all hosts.

    An enum that represents a particular host configuration.
]=]
export type Host = {
    None: number,
    Client: number,
    Server: number,
    All: number
}

--[[
    Represents a particular host configuration.
]]
return {
    --[[
        Represents properties of no particular host.
    ]]
    None = 1,

    --[[
        Represents properties of the client.
    ]]
    Client = 2,

    --[[
        Represents properties of the server.
    ]]
    Server = 3,

    --[[
        Represents properties of all hosts.
    ]]
    All = 4
} :: Host