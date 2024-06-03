import { World, useEvent } from "@rbxts/matter";
import { RootProducer } from "server/store";
import { idleAnimationIds, movementAnimationIds, walkAnimationIds } from "shared/assets/animation";
import { LedgeHold, LedgeInfo, Model } from "shared/ecs/components";
import { StateType } from "shared/ecs/types";

function resetLedgeData(world: World, state: StateType) {
	const reflexState = state.reflex as RootProducer;

	for (const [id, model] of world.query(Model)) {
		if (!model.model) continue;
		for (const _ of useEvent(model.humanoid as Humanoid, "Died")) {
			world.remove(id, LedgeHold, LedgeInfo);
			reflexState.changeAnimationId(tostring(id), "walk", walkAnimationIds.walk);
			reflexState.changeAnimationId(tostring(id), "idle", idleAnimationIds.idle);
			reflexState.changeAnimationId(tostring(id), "land", movementAnimationIds.land);
			break;
		}
	}

	for (const [_, record] of world.queryChanged(LedgeHold)) {
		if (record.new) continue;
		record.old?.part?.Destroy();
	}
}

export = resetLedgeData;
