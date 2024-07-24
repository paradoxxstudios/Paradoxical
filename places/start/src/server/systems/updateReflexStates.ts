import { World } from "@rbxts/matter";
import loadPlayerData from "./loadPlayerData";
import { Health } from "shared/ecs/components";
import { StateType } from "shared/ecs/types";
import { RootProducer } from "../../shared/store/client";

function updateReflexStates(world: World, state: StateType): void {
	for (const [id, record] of world.queryChanged(Health)) {
		if (record.new === undefined) continue;
		(state.reflex as RootProducer).changeHealth(id + "", record.new);
	}
}

export = {
	system: updateReflexStates,
	after: [loadPlayerData],
};
