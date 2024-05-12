import { World, useDeltaTime, useEvent } from "@rbxts/matter";
import { Model } from "shared/ecs/components";
import { RootProducer } from "shared/state/client";
import loadAnimations from "./loadAnimations";
import { PlayerAnimations } from "shared/state/shared/slices/players";

function playAnimations(world: World, state: RootProducer) {
	for (const [id, model] of world.query(Model)) {
		const animations = state.getState().players.animation[id + ""] as PlayerAnimations;
		state.changeJumpAnimTime(
			id + "",
			(state.getState().players.animation[id + ""]?.jumpAnimTime as number) - useDeltaTime(),
		);

		for (const [_, _oldState, newState] of useEvent(model.humanoid as Humanoid, "StateChanged")) {
			switch (newState) {
				case Enum.HumanoidStateType.Jumping: {
					state.playAnimation(id + "", animations.jump as AnimationTrack);
					state.changeJumpAnimTime(id + "", 0.3);
					break;
				}
				case Enum.HumanoidStateType.Freefall: {
					state.toggleFreefall(id + "");
					break;
				}
			}
		}

		if (
			state.getState().players.animation[id + ""]?.freefalling &&
			state.getState().players.animation[id + ""]?.jumpAnimTime === 0
		) {
			state.toggleFreefall(id + "");
			state.playAnimation(id + "", animations.land as AnimationTrack);
		}

		if (animations.jump?.IsPlaying || animations.land?.IsPlaying) continue;
		if (model.humanoid?.MoveDirection.Magnitude !== 0) {
			state.playAnimation(id + "", animations.walk as AnimationTrack);
		} else {
			state.playAnimation(id + "", animations.idle as AnimationTrack);
		}
	}
}

export = {
	system: playAnimations,
	after: [loadAnimations],
};
