import { World } from "@rbxts/matter";
import loadPlayerData from "./loadPlayerData";
import { Health } from "shared/ecs/components";
import { RootProducer } from "server/store";
import { Players } from "@rbxts/services";

function updateReflexStates(world: World, state: RootProducer): void {
	for (const [id, record] of world.queryChanged(Health)) {
		if (record.new === undefined) continue;
		state.changeHealth(Players.GetNameFromUserIdAsync(id), record.new);
	}
}

export = {
	system: updateReflexStates,
	after: [loadPlayerData],
};
