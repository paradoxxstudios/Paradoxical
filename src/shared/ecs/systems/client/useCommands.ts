import { World } from "@rbxts/matter";
import { StateType } from "shared/ecs/types";
import { commands } from "shared/net";

function useCommands(world: World, state: StateType) {
	const sparkState = state.spark;
	const actions = sparkState.actions;

	if (actions.justPressed("crouch")) {
		commands.handleCommands.send(2);
	}
}

export = useCommands;
