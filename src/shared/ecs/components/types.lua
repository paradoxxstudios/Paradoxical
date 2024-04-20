--[[
  _______   _____ ___ ___
 |_   _\ \ / / _ \ __/ __|
   | |  \ V /|  _/ _|\__ \
   |_|   |_| |_| |___|___/
]]--

--[=[
    The GameComponent type.

    @type GameComponent Model | Transform | Health
    @within Components

    A [Model], [Transform], or [Health] interface
]=]
export type GameComponentType =
        Model
        | Transform
        | Health

--[=[
    The Model component.

    @interface Model
    @within Components
    .model PVInstance -- Provides a reference to the [PVInstance] that represents the attached entity.
]=]
export type Model = {
    model: PVInstance | nil
}

--[=[
    The Transform component.

    @interface Transform
    @within Components
    .cframe CFrame -- Provides a reference to the [CFrame] that represents the world tranform of the attached entity.
]=]
export type Transform = {
    cframe: CFrame
}

--[=[
    The Health component.

    @interface Health
    @within Components
    .health number -- The current health amount.
    .maxHealth number -- The max health.
    .regenAmount number -- The amount in which the health increases per regen rate.
    .regenRate number -- The rate in which your health regens by.

    Holds health information.
]=]
export type Health = {
    health: number,
    maxHealth: number,
    regenAmount: number,
    regenRate: number,
}


--[[
  ___  ___ ___ _  _   _ _  _____ ___
 |   \| __| __/_\| | | | ||_   _/ __|
 | |) | _|| _/ _ \ |_| | |__| | \__ \
 |___/|___|_/_/ \_\___/|____|_| |___/
]]--

--[[
    The default value created when no data is provided to a Transform component.
]]
local tranform: Transform = {
    cframe = CFrame.identity
}


--[[
   ___ _      _   ___ ___
  / __| |    /_\ / __/ __|
 | (__| |__ / _ \\__ \__ \
  \___|____/_/ \_\___/___/
]]--

--[=[
    @prop Defaults {string: GameComponent}
    @within Components

    A dictionary containing default values for some [GameComponent]s.
    - Transform: CFrame.identity
]=]
local Defaults = {
    ["Transform"] = tranform,
}

--[=[
    @prop Components {string}
    @within Components

    A table of strings containing the names for the [GameComponent]s.
]=]
local Components = {
    "Model",
    "Transform",
    "Health"
}

--[=[
    @class Components
    A class that contains the types and default values for the components.
]=]
return {
    defaults = Defaults,
    components = Components
}