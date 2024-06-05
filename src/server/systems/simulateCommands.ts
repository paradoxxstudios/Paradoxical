import { World } from "@rbxts/matter";
import { RootProducer } from "server/store";
import { Crouching, LedgeHold, Running } from "shared/ecs/components";
import { StateType } from "shared/ecs/types";
import useBytenet from "shared/hooks/useBytenet";
import { commands } from "shared/net";

enum Commands {
	"Move",
	"Jump",
	"Crouch",
	"Run",
	"__LENGTH",
}

function processCommands(world: World, state: StateType) {
	const reflexState = state.reflex as RootProducer;

	for (const [_, data, player] of useBytenet("id", commands.handleCommands)) {
		if (player === undefined) continue;
		if (typeOf(data.id) !== "number" || data.id < 0 || data.id >= Commands.__LENGTH) continue;

		const crouching = world.get(player.UserId, Crouching);
		const running = world.get(player.UserId, Running);
		const ledgeHold = world.get(player.UserId, LedgeHold);

		switch (data.id) {
			case Commands.Jump: {
				if (data.input) {
					reflexState.toggleJumped(player.UserId + "");
				}
				break;
			}
			case Commands.Crouch: {
				if (running !== undefined || ledgeHold !== undefined) break;
				if (crouching === undefined && data.input) {
					world.insert(player.UserId, Crouching());
				} else {
					world.remove(player.UserId, Crouching);
				}
				break;
			}
			case Commands.Run: {
				if (crouching !== undefined || ledgeHold !== undefined) break;
				if (running === undefined && data.input) {
					world.insert(player.UserId, Running());
				} else {
					world.remove(player.UserId, Running);
				}
				break;
			}
		}
	}

	for (const [_, data, player] of useBytenet("move", commands.movement)) {
		if (player === undefined) continue;
		if (data.x > 1 || data.x < -1) continue;
		if (data.y > 1 || data.y < -1) continue;

		reflexState.changeMoveDirection(player.UserId + "", data.x);
	}
}

export = processCommands;
