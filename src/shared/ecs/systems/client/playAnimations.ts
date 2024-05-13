import { World, useDeltaTime, useEvent } from "@rbxts/matter";
import { Model } from "shared/ecs/components";
import { RootProducer } from "shared/state/client";
import loadAnimations from "./loadAnimations";
import { PlayerAnimations } from "shared/state/shared/slices/players";
import { playerId } from "shared/constants";

function playAnimations(world: World, state: RootProducer) {
	for (const [_, model] of world.query(Model)) {
		const animations = state.getState().players.animation[playerId] as PlayerAnimations;
		state.changeJumpAnimTime(
			playerId,
			(state.getState().players.animation[playerId]?.jumpAnimTime as number) - useDeltaTime(),
		);

		for (const [_, _oldState, newState] of useEvent(model.humanoid as Humanoid, "StateChanged")) {
			switch (newState) {
				case Enum.HumanoidStateType.Jumping: {
					state.playAnimation(playerId, animations.jump as AnimationTrack);
					state.changeJumpAnimTime(playerId, 0.3);
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
			state.playAnimation(playerId, animations.land as AnimationTrack);
		}

		if (animations.jump?.IsPlaying || animations.land?.IsPlaying) continue;
		if (model.humanoid?.MoveDirection.Magnitude !== 0) {
			state.playAnimation(playerId, animations.walk as AnimationTrack);
		} else {
			state.playAnimation(playerId, animations.idle as AnimationTrack);
		}
	}
}

export = {
	system: playAnimations,
	after: [loadAnimations],
};
