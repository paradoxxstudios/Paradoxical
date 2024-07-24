import { World } from "@rbxts/matter";
import { StateType } from "shared/ecs/types";

function updateInput(_: World, state: StateType) {
	const sparkState = state.spark;
	sparkState.actions.update(sparkState.inputState, sparkState.inputMap);
	sparkState.inputState.clear();
}

export = {
	system: updateInput,
	event: "renderedStepped",
	priority: -math.huge,
};
