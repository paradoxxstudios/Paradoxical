import { World } from "@rbxts/matter";
import { StateType } from "shared/ecs/types";

function sparkTest(_: World, state: StateType) {
	const sparkState = state.spark;
	const actions = sparkState.actions;

	if (actions.justPressed("jump")) {
		print("jumped!");
	}

	const move = actions.clampedAxis2d("move");
	if (move.Magnitude > 0) {
		print("moving", move);
	}
}

export = sparkTest;
