import { World, useDeltaTime, useEvent } from "@rbxts/matter";
import { playerId } from "shared/constants";
import { Model } from "shared/ecs/components";
import { RootProducer } from "shared/state/client";
import { PlayerAnimations } from "shared/state/shared/slices/players";
import loadAnimations from "./loadAnimations";
import { StateType } from "shared/ecs/types";

function playAnimations(world: World, state: StateType) {
	const relfexState = state.reflex as RootProducer;

	if (!world.contains(tonumber(playerId) as number)) return;
	const model = world.get(tonumber(playerId) as number, Model);
	const humanoid = model?.humanoid as Humanoid;

	const animationState = relfexState.getState().players.animation[playerId] as PlayerAnimations;
	if (animationState.idle === undefined) return;

	relfexState.changeJumpAnimTime(playerId, animationState.jumpAnimTime - useDeltaTime());

	for (const [_, __, newState] of useEvent(humanoid, "StateChanged")) {
		switch (newState) {
			case Enum.HumanoidStateType.Jumping: {
				relfexState.playAnimation(playerId, animationState.jump as AnimationTrack);
				relfexState.changeJumpAnimTime(playerId, 0.35);
				break;
			}
			case Enum.HumanoidStateType.Freefall: {
				relfexState.toggleFreefall(playerId);
				break;
			}
		}
	}

	if (
		relfexState.getState().players.animation[playerId]?.freefalling &&
		relfexState.getState().players.animation[playerId]?.jumpAnimTime === 0
	) {
		relfexState.toggleFreefall(playerId);
		relfexState.playAnimation(playerId, animationState.land as AnimationTrack);
	}

	if (animationState.jump?.IsPlaying || animationState.land?.IsPlaying) return;
	if (humanoid.MoveDirection.Magnitude !== 0) {
		if (humanoid.WalkSpeed <= 16) {
			relfexState.playAnimation(playerId, animationState.walk as AnimationTrack);
		} else {
			relfexState.playAnimation(playerId, animationState.run as AnimationTrack);
		}
	} else {
		relfexState.playAnimation(playerId, animationState.idle as AnimationTrack);
	}
}

export = {
	system: playAnimations,
	after: [loadAnimations],
};
