import { createProducer } from "@rbxts/reflex";
import { AnimationKeys, PlayerAnimations } from "./types";

export interface AnimationState {
	readonly [player: string]: PlayerAnimations | undefined;
}

const initialState: AnimationState = {};

export const animationSlice = createProducer(initialState, {
	loadAnimationPlayer: (state, player: string) => ({
		...state,
		[player]: { jumpAnimTime: 0, freefalling: false, loaded: false },
	}),

	closeAnimationPlayer: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	setAnimation: (state, player: string, animation: AnimationKeys, newAnimation: AnimationTrack) => {
		const animations = state[player];

		return {
			...state,
			[player]: animations && {
				...animations,
				[animation]: newAnimation,
			},
		};
	},

	playAnimation: (state, player: string, animation: AnimationTrack) => {
		const animations = state[player];

		if (animation === animations?.current) return { ...state };
		animations?.current?.Stop(0.1);
		animation.Play(0.1);

		return {
			...state,
			[player]: animations && {
				...animations,
				current: animation,
			},
		};
	},

	clearAnimations: (state, player: string) => {
		return {
			...state,
			[player]: { jumpAnimTime: 0, freefalling: false, loaded: false },
		};
	},

	changeJumpAnimTime: (state, player: string, amount: number) => {
		const animations = state[player];

		return {
			...state,
			[player]: animations && {
				...animations,
				jumpAnimTime: math.max(0, amount),
			},
		};
	},

	toggleFreefall: (state, player: string) => {
		const animations = state[player];

		return {
			...state,
			[player]: animations && {
				...animations,
				freefalling: !animations.freefalling,
			},
		};
	},

	LoadedAnimations: (state, player: string) => {
		const animations = state[player];

		return {
			...state,
			[player]: animations && {
				...animations,
				loaded: true,
			},
		};
	},
});
