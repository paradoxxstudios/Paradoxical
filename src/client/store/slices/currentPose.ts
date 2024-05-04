import { createProducer } from "@rbxts/reflex";

export enum AnimationPose {
	Idle,
	Walking,
	Running,
	Jumping,
	Freefall,
	Landed,
}

export interface AnimationState {
	readonly current: AnimationPose;
}

const initialState: AnimationState = {
	current: AnimationPose.Idle,
};

export const currentPose = createProducer(initialState, {
	changePose: (state, pose: AnimationPose) => ({
		...state,
		current: pose,
	}),
});
