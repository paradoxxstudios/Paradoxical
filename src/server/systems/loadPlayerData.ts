import { World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { RootProducer } from "server/store/index";
import { Health } from "shared/ecs/components";
import spawnPlayers from "./spawnPlayers";
import { State } from "shared/state/shared/slices/players";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { Health as HealthType } from "shared/ecs/components/types";

const isInserted = new Array<string>();

function loadPlayerData(world: World, state: RootProducer) {
	// eslint-disable-next-line prettier/prettier
    const data = new Map<ComponentCtor, State>([
        [Health, state.getState().players.health],
    ])

	for (const player of Players.GetPlayers()) {
		if (isInserted.includes(player.Name)) continue;
		if ((data.get(Health) as State)[player.Name] === undefined) continue;
		if (!world.contains(player.UserId)) continue;

		for (const [component, state] of data) {
			world.insert(player.UserId, component().patch(state[player.Name] as HealthType));
		}

		isInserted.push(player.Name);
	}
}

export = {
	system: loadPlayerData,
	after: [spawnPlayers],
};
