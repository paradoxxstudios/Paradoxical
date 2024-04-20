--[=[
    @interface StateType
    @within ECS
    .debugEnabled boolean -- Whether to display debug or not.

    The State type.
]=]
export type StateType = {
    debugEnabled: boolean
}

--[=[
    @prop State StateType
    @within ECS

    The global ECS state.
]=]
local State = {}
State.__index = State

State.debugEnabled = false

function State.new()
    return setmetatable({}, State)
end

return State