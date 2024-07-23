import { World } from "@rbxts/matter";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { RootProducer } from "server/store";
import { Crouching, LedgeHold, Running } from "shared/ecs/components";
import { statusComponents } from "shared/ecs/components/statusComponents";
import { StateType } from "shared/ecs/types";
import useBytenet from "shared/hooks/useBytenet";
import { commands } from "shared/net";

function canProceed(id: number, world: World, exluded?: Array<ComponentCtor>): boolean {
	const arr = statusComponents.filter((value) => !exluded?.includes(value));
	for (const component of arr) {
		if (world.get(id, component) !== undefined) return false;
	}
	return true;
}

enum Commands {
	"Move",
	"Jump",
	"Crouch",
	"Run",
	"Dash",
	"__LENGTH",
}

function processCommands(world: World, state: StateType) {
	const reflexState = state.reflex as RootProducer;

	for (const [_, data, player] of useBytenet("id", commands.handleCommands)) {
		if (player === undefined) continue;
		if (typeOf(data.id) !== "number" || data.id < 0 || data.id >= Commands.__LENGTH) continue;

		switch (data.id) {
			case Commands.Jump: {
				if (data.input) {
					reflexState.toggleJumped(player.UserId + "");
				}
				break;
			}
			case Commands.Crouch: {
				if (!canProceed(player.UserId, world, [Crouching])) break;
				if (world.get(player.UserId, Crouching) === undefined && data.input) {
					world.insert(player.UserId, Crouching());
				} else {
					world.remove(player.UserId, Crouching);
				}
				break;
			}
			case Commands.Run: {
				if (!canProceed(player.UserId, world, [Running])) break;
				if (world.get(player.UserId, Running) === undefined && data.input) {
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
