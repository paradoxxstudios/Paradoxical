--[=[
    @prop IdAttribute IdAttribute
    @within ECS

    The [IdAttribute] class.
]=]

local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Host = require(ReplicatedStorage.paradoxical.ecs.hosts)

--[=[
    @class IdAttribute

    A class for setting up attributes.
]=]
local IdAttribute = {}

--[=[
    @prop unknownIdAttribute string
    @within IdAttribute

    A string that represents the default ID attribute when the environment is not client or server.
]=]
IdAttribute.unknownIdAttribute = "unknownEntityId"

--[=[
    @prop serverIdAttribute string
    @within IdAttribute

    A string that represents the ID attribute when the environment is the server.
]=]
IdAttribute.serverIdAttribute = "serverEntityId"

--[=[
    @prop clientIdAttribute string
    @within IdAttribute

    A string that represents the ID attribute when the environment is the client.
]=]
IdAttribute.clientIdAttribute = "clientEntityId"

--[=[
    @prop idAttribute string
    @within IdAttribute

    A string that represents the current id attribute.
]=]
local idAttribute = IdAttribute.unknownIdAttribute;

--[=[
    @method getIdAttribute
    @within IdAttribute

    @return string -- returns the idAttribute

    Gets a string that represents the current ID attribute being used. This value defualts to [IdAttribute.unknownIdAttribute].
]=]
function IdAttribute:getIdAttribute()
    return idAttribute
end

--[=[
    @method setEnviorment
    @within IdAttribute

    @param enviorment Host -- The enviorment to set the ID attribute for

    Sets [IdAttribute.idAttribute] based on the provied enviorment.
]=]
function IdAttribute:setEnviorment(enviorment: Host.Host)
    if enviorment == Host.Server then
        idAttribute = IdAttribute.serverIdAttribute
    elseif enviorment == Host.Client then
        idAttribute = IdAttribute.clientIdAttribute
    else
        idAttribute = IdAttribute.unknownIdAttribute
    end
end

return IdAttribute