import { World } from "@rbxts/matter";
import { StateType } from "shared/ecs/types";
import { commands } from "shared/net";
import { Actions } from "shared/spark";
import { ActionKeys } from "shared/spark/actions";

function startAction(actions: Actions<string[]>, action: ActionKeys, id: number, callback?: () => boolean) {
	if (callback && callback()) return;

	if (actions.justPressed(action)) {
		commands.handleCommands.send({
			id: id,
			input: true,
		});
	}

	if (actions.justReleased(action)) {
		commands.handleCommands.send({
			id: id,
			input: false,
		});
	}
}

function useCommands(_: World, state: StateType) {
	const sparkState = state.spark;
	const actions = sparkState.actions;

	const move = actions.clampedAxis2d("move");
	commands.movement.send({ x: move.X, y: move.Y });

	startAction(actions, "jump", 1);
	startAction(actions, "crouch", 2);
	startAction(actions, "run", 3);
}

export = useCommands;
