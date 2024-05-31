import { World } from "@rbxts/matter";
import { RootProducer } from "server/store";
import { walkAnimationIds } from "shared/assets/animation";
import { Crouching, Running } from "shared/ecs/components";
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
	for (const [_, data, player] of useBytenet("id", commands.handleCommands)) {
		if (player === undefined) continue;
		if (typeOf(data.id) !== "number" || data.id < 0 || data.id >= Commands.__LENGTH) continue;

		const crouching = world.get(player.UserId, Crouching);
		const running = world.get(player.UserId, Running);

		switch (data.id) {
			case Commands.Crouch: {
				if (running !== undefined) break;
				if (crouching === undefined && data.input) {
					world.insert(player.UserId, Crouching());
				} else {
					world.remove(player.UserId, Crouching);
				}
				break;
			}
			case Commands.Run: {
				if (crouching !== undefined) break;
				if (running === undefined && data.input) {
					world.insert(player.UserId, Running());
				} else {
					world.remove(player.UserId, Running);
				}
				break;
			}
		}
	}
}

export = processCommands;
