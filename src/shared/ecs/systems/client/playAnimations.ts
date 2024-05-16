import { World, useDeltaTime, useEvent } from "@rbxts/matter";
import { playerId } from "shared/constants";
import { Model } from "shared/ecs/components";
import { RootProducer } from "shared/state/client";
import { PlayerAnimations } from "shared/state/shared/slices/players";
import loadAnimations from "./loadAnimations";

function playAnimations(world: World, state: RootProducer) {
	if (!world.contains(tonumber(playerId) as number)) return;

	const model = world.get(tonumber(playerId) as number, Model);
	const humanoid = model?.humanoid as Humanoid;

	const animationState = state.getState().players.animation[playerId] as PlayerAnimations;
	if (animationState.idle === undefined) return;

	state.changeJumpAnimTime(playerId, animationState.jumpAnimTime - useDeltaTime());

	for (const [_, __, newState] of useEvent(humanoid, "StateChanged")) {
		switch (newState) {
			case Enum.HumanoidStateType.Jumping: {
				state.playAnimation(playerId, animationState.jump as AnimationTrack);
				state.changeJumpAnimTime(playerId, 0.35);
				break;
			}
			case Enum.HumanoidStateType.Freefall: {
				state.toggleFreefall(playerId);
				break;
			}
		}
	}

	if (
		state.getState().players.animation[playerId]?.freefalling &&
		state.getState().players.animation[playerId]?.jumpAnimTime === 0
	) {
		state.toggleFreefall(playerId);
		state.playAnimation(playerId, animationState.land as AnimationTrack);
	}

	if (animationState.jump?.IsPlaying || animationState.land?.IsPlaying) return;
	if (humanoid.MoveDirection.Magnitude !== 0) {
		state.playAnimation(playerId, animationState.walk as AnimationTrack);
	} else {
		state.playAnimation(playerId, animationState.idle as AnimationTrack);
	}
}

export = {
	system: playAnimations,
	after: [loadAnimations],
};
