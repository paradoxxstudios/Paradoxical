import { World } from "@rbxts/matter";
import useBytenet from "shared/hooks/useBytenet";
import { commands } from "shared/net";

function simulateCommands(world: World) {
	for (const [_, data, player] of useBytenet("10", commands.handleCommands)) {
		print(data, player);
	}
}

export = simulateCommands;
