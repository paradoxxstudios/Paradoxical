local Matter = require(game:GetService("ReplicatedStorage").rbxts_include.node_modules["@rbxts"].matter.lib)
local Spark = require(game:GetService("ReplicatedStorage").rbxts_include.node_modules["@rbxts"].spark.out)
local Actions = Spark.Actions
local InputState = Spark.InputState

local actions = require(script.actions)
local inputMap = require(script.inputMap)

function Actions:justPressed(action: string): boolean
	local signal = self:justPressedSignal(action)
	local iterator = Matter.useEvent(action, signal)

	return iterator() ~= nil
end

function Actions:justReleased(action: string): boolean
	local signal = self:justReleasedSignal(action)
	local iterator = Matter.useEvent(action, signal)

	return iterator() ~= nil
end

return {
	sparkState = {
		inputState = InputState.new(),
		actions = Actions.new(actions.actions),
		inputMap = inputMap,
	}
}