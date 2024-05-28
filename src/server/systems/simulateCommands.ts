import { World } from "@rbxts/matter";
import { RootProducer } from "server/store";
import { walkAnimationIds } from "shared/assets/animation";
import { Crouching } from "shared/ecs/components";
import { StateType } from "shared/ecs/types";
import useBytenet from "shared/hooks/useBytenet";
import { commands } from "shared/net";

enum Commands {
	"Move",
	"Jump",
	"Crouch",
	"__LENGTH",
}

function processCommands(world: World, state: StateType) {
	for (const [_, data, player] of useBytenet("id", commands.handleCommands)) {
		if (player === undefined) continue;
		if (typeOf(data) !== "number" || data < 0 || data >= Commands.__LENGTH) continue;

		switch (data) {
			case Commands.Crouch: {
				const crouching = world.get(player.UserId, Crouching);
				if (crouching === undefined) {
					world.insert(player.UserId, Crouching());
				} else {
					world.remove(player.UserId, Crouching);
				}
				break;
			}
		}
	}
}

export = processCommands;
