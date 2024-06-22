import { createProducer } from "@rbxts/reflex";
import { AnimationKeys, PlayerAnimationIds } from "./types";
import { walkAnimationIds } from "shared/assets/animation";

export const defualtAnimationIds = {
	idle: 14385447903,
	walk: walkAnimationIds.walk,
	run: 14385478299,
	jump: 14385475041,
	land: 14385470658,
};

export interface AnimationIdState {
	[player: string]: PlayerAnimationIds | undefined;
}

const initialState: AnimationIdState = {};

export const animationIdSlice = createProducer(initialState, {
	loadAnimationIdPlayer: (state, player: string) => ({
		...state,
		[player]: defualtAnimationIds,
	}),

	closeAnimationIdPlayer: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	changeAnimationId: (state, player: string, key: AnimationKeys, id: number) => {
		const animationId = state[player];

		return {
			...state,
			[player]: animationId && {
				...animationId,
				[key]: id,
			},
		};
	},
});
