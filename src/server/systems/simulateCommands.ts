import { World } from "@rbxts/matter";
import { Crouching, LedgeHold, LedgeInfo, Running } from "shared/ecs/components";
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
		const ledgeInfo = world.get(player.UserId, LedgeInfo);
		const ledgeHold = world.get(player.UserId, LedgeHold);

		switch (data.id) {
			case Commands.Jump: {
				if (ledgeInfo === undefined) continue;
				if (data.input) {
					world.insert(player.UserId, ledgeInfo.patch({ jumped: !ledgeInfo.jumped }));
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

		const ledgeInfo = world.get(player.UserId, LedgeInfo);
		if (!ledgeInfo) continue;
		world.insert(player.UserId, ledgeInfo.patch({ moveDirection: data.x }));
	}
}

export = processCommands;
