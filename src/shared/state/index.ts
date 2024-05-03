import { InferState, combineProducers } from "@rbxts/reflex";
import { currentPose } from "./client/animationState";
import { debugEnabled } from "./client/debugEnabled";

export type ServerRootProducer = typeof serverState;
export type ServerRootState = InferState<ServerRootProducer>;

export type ClientRootProducer = typeof clientState;
export type ClientRootState = InferState<ClientRootProducer>;

export type SharedRootProducer = typeof sharedState;
export type SharedRootState = InferState<SharedRootProducer>;

export interface State {
	state: ServerRootProducer | ClientRootProducer;
	shared?: SharedRootProducer;
}

export const serverState = combineProducers({
	
});

export const clientState = combineProducers({
	animationPose: currentPose,
	debugEnabled: debugEnabled,
});

export const sharedState = combineProducers({
	
});
