import { World } from "@rbxts/matter";
import { Model } from "shared/ecs/components";
import { RootProducer } from "shared/state/client";

function spawnAnimator(world: World, state: RootProducer) {
	for (const [id, model] of world.query(Model)) {
		const animator = model.animator;
		if (animator) continue;
		world.insert(id, model.patch({ animator: model.humanoid?.FindFirstChildOfClass("Animator") }));
		state.clearAnimations(tostring(id));
	}
}

export = spawnAnimator;
