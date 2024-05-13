import { World } from "@rbxts/matter";
import { ReplicatedStorage } from "@rbxts/services";
import { Model } from "shared/ecs/components";
import { RootProducer } from "shared/state/client";
import { AnimationKeys } from "shared/state/shared/slices/players";
import spawnAnimator from "./spawnAnimator";
import { useMap } from "@rbxts/matter-hooks";
import { selectPlayerAnimation, selectPlayerAnimationIds } from "shared/state/shared/selectors";
import useReflex from "shared/hooks/useReflex";
import { playerId } from "shared/constants";

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
		for (const [_, current, previous] of useReflex(playerId, state, selectPlayerAnimationIds(playerId))) {
			print(_, current, previous);
		}

		const latestIdle = useMap<undefined | AnimationTrack>(id, undefined);
		if (state.getState().players.animation[playerId]?.idle) continue;

		for (const [name, animation] of animations) {
			const track = model.animator?.LoadAnimation(animation) as AnimationTrack;
			track.Priority = Enum.AnimationPriority.Core;
			state.setAnimation(playerId, name, track);
			if (name === "idle") {
				if (latestIdle.value === undefined) {
					latestIdle.value = track;
				} else {
					latestIdle.value.Stop();
					latestIdle.value = track;
				}
				state.playAnimation(playerId, track);
			}
		}
	}
}

export = {
	system: loadAnimations,
	after: [spawnAnimator],
};
