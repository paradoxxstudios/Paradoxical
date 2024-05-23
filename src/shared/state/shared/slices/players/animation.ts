import { createProducer } from "@rbxts/reflex";
import { AnimationKeys, PlayerAnimations } from "./types";

export interface AnimationState {
	readonly [player: string]: PlayerAnimations | undefined;
}

const initialState: AnimationState = {};

export const animationSlice = createProducer(initialState, {
	loadAnimationPlayer: (state, player: string) => ({
		...state,
		[player]: { jumpAnimTime: 0, freefalling: false, playingAnimations: [] },
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
		const playingAnimations = animations?.playingAnimations as AnimationTrack[];

		if (playingAnimations[0] && !playingAnimations[0].IsPlaying) {
			playingAnimations.clear();
			playingAnimations[0] = animation;
			animation.Play(0.1);
		} else {
			if (animation === playingAnimations[0]) return { ...state };
			for (let i = 0; i < playingAnimations.size(); i++) {
				playingAnimations[i].Stop(0.1);
			}
			playingAnimations.clear();
			playingAnimations[0] = animation;
			animation.Play(0.1);
		}

		return {
			...state,
			[player]: animations && {
				...animations,
				playingAnimations: playingAnimations,
			},
		};
	},

	clearAnimations: (state, player: string) => {
		return {
			...state,
			[player]: { jumpAnimTime: 0, freefalling: false, playingAnimations: [] },
		};
	},

	clearPlayingAnimations: (state, player: string) => {
		const animations = state[player];

		return {
			...state,
			[player]: animations && {
				...animations,
				playingAnimations: [],
			},
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
});
