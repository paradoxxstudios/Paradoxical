import { InferState, combineProducers } from "@rbxts/reflex";
import { currentPose } from "./animationState";
import { debugEnabled } from "./debugEnabled";

export type RootProducer = typeof state;

export type RootState = InferState<RootProducer>;

/**
 * The global ECS state.
 */
export const state = combineProducers({
	animationPose: currentPose,
	debugEnabled: debugEnabled,
});
