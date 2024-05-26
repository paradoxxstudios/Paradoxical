import { World } from "@rbxts/matter";
import { StateType } from "shared/ecs/types";
import { commands } from "shared/net";
import { Actions } from "shared/spark";
import { ActionKeys } from "shared/spark/actions";

function startAction(actions: Actions<string[]>, action: ActionKeys, id: number, callback?: () => boolean) {
	if (callback && callback()) return;

	if (actions.justPressed(action)) {
		commands.handleCommands.send(id);
	}

	if (actions.justReleased(action)) {
		commands.handleCommands.send(id);
	}
}

function useCommands(world: World, state: StateType) {
	const sparkState = state.spark;
	const actions = sparkState.actions;

	startAction(actions, "crouch", 2);
}

export = useCommands;
