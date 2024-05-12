import { World } from "@rbxts/matter";
import { ReplicatedStorage } from "@rbxts/services";
import { Model } from "shared/ecs/components";
import { RootProducer } from "shared/state/client";
import { AnimationKeys } from "shared/state/shared/slices/players";
import spawnAnimator from "./spawnAnimator";
import { useMap } from "@rbxts/matter-hooks";

const animationFolder = ReplicatedStorage.WaitForChild("assets")?.WaitForChild("animations");

const animations = new Map<AnimationKeys, Animation>([
	["idle", animationFolder?.FindFirstChild("idle")?.FindFirstChild("idle") as Animation],
	["walk", animationFolder?.FindFirstChild("walk")?.FindFirstChild("walk") as Animation],
	["run", animationFolder?.FindFirstChild("movement")?.FindFirstChild("run") as Animation],
	["jump", animationFolder?.FindFirstChild("movement")?.FindFirstChild("jump") as Animation],
	["land", animationFolder?.FindFirstChild("movement")?.FindFirstChild("land") as Animation],
]);

function loadAnimations(world: World, state: RootProducer) {
	for (const [id, model] of world.query(Model)) {
		const latestIdle = useMap<undefined | AnimationTrack>(id, undefined);
		if (state.getState().players.animation[id + ""]?.idle) continue;

		for (const [name, animation] of animations) {
			const track = model.animator?.LoadAnimation(animation) as AnimationTrack;
			track.Priority = Enum.AnimationPriority.Core;
			state.setAnimation(id + "", name, track);
			if (name === "idle") {
				if (latestIdle.value === undefined) {
					latestIdle.value = track;
				} else {
					latestIdle.value.Stop();
					latestIdle.value = track;
				}
				state.playAnimation(id + "", track);
			}
		}
	}
}

export = {
	system: loadAnimations,
	after: [spawnAnimator],
};
