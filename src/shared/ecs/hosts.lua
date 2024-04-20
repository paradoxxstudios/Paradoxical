type None = number
type Client = number
type Server = number
type All = number

--[=[
    @interface Host
    @within ECS
    .None 1 -- Represents properties of no particular host.
    .Client 2 -- Represents properties of the client.
    .Server 3 -- Represents properties of the server.
    .All 4 -- Represents properties of all hosts.

    An enum that represents a particular host configuration.
]=]
export type Host = None | Client | Server | All

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
}