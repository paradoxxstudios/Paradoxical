import { World } from "@rbxts/matter";
import { RootProducer } from "server/store";
import { idleAnimationIds, walkAnimationIds } from "shared/assets/animation";
import { Crouching, Model } from "shared/ecs/components";
import { StateType } from "shared/ecs/types";

function crouching(world: World, state: StateType) {
	const reflexState = state.reflex as RootProducer;

	for (const [id, record] of world.queryChanged(Crouching)) {
		const humanoid = world.get(id, Model)?.humanoid as Humanoid;
		if (record.old === undefined) {
			reflexState.changeAnimationId(tostring(id), "walk", walkAnimationIds.crouch);
			reflexState.changeAnimationId(tostring(id), "idle", idleAnimationIds.crouch);
			humanoid.WalkSpeed = 4;
			humanoid.JumpPower = 0;
		} else if (record.new === undefined) {
			reflexState.changeAnimationId(tostring(id), "walk", walkAnimationIds.walk);
			reflexState.changeAnimationId(tostring(id), "idle", idleAnimationIds.idle);
			humanoid.WalkSpeed = 16;
			humanoid.JumpPower = 50;
		}
	}
}

export = crouching;
