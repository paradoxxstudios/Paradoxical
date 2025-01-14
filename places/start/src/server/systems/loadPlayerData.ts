import { World } from "@rbxts/matter";
import { Players, Workspace } from "@rbxts/services";
import { Health } from "shared/ecs/components";
import spawnPlayers from "./spawnPlayers";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { StateType } from "shared/ecs/types";
import { RootProducer } from "../../shared/store/client";
import { PlayerState } from "../../shared/store/shared/slices/players";

const isInserted = new Array<number>();

function loadPlayerData(world: World, state: StateType) {
	for (const player of Players.GetPlayers()) {
		if (isInserted.includes(player.UserId)) continue;
		const relfexState = state.reflex as RootProducer;

		// eslint-disable-next-line prettier/prettier
		const data = new Map<ComponentCtor, PlayerState>([
			[Health, relfexState.getState().players.health],
		])

		let shouldContinue = true;
		for (const [_, state] of data) {
			if (state[player.UserId] === undefined) {
				shouldContinue = false;
				break;
			}
		}
		if (!shouldContinue) continue;

		if (!world.contains(player.UserId)) continue;

		for (const [component, state] of data) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			world.insert(player.UserId, component().patch(state[player.UserId] as any));
		}

		isInserted.push(player.UserId);
	}
}

export = {
	system: loadPlayerData,
	after: [spawnPlayers],
};
