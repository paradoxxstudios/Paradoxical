import { World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { RootProducer } from "server/store/index";
import { Health } from "shared/ecs/components";
import spawnPlayers from "./spawnPlayers";
import { PlayerState } from "shared/state/shared/slices/players";
import { ComponentCtor } from "@rbxts/matter/lib/component";

const isInserted = new Array<string>();

function loadPlayerData(world: World, state: RootProducer) {
	for (const player of Players.GetPlayers()) {
		if (isInserted.includes(player.Name)) continue;

		// eslint-disable-next-line prettier/prettier
		const data = new Map<ComponentCtor, PlayerState>([
			[Health, state.getState().players.health],
		])

		let shouldContinue = true;
		for (const [_, state] of data) {
			if (state[player.Name] === undefined) {
				shouldContinue = false;
				break;
			}
		}
		if (!shouldContinue) continue;

		if (!world.contains(player.UserId)) continue;

		for (const [component, state] of data) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			world.insert(player.UserId, component().patch(state[player.Name] as any));
		}

		isInserted.push(player.Name);
	}
}

export = {
	system: loadPlayerData,
	after: [spawnPlayers],
};
