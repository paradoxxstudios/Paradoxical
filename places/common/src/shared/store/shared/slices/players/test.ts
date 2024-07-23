import { createProducer } from "@rbxts/reflex";

export interface AnimationIdState {
	[player: string]: {test: number} | undefined;
}

const initialState: AnimationIdState = {};

export const test = createProducer(initialState, {
	loadAnimationIdPlayer: (state, player: string) => ({
		...state,
		[player]: {test: 1},
	}),

	closeAnimationIdPlayer: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	increaseTest: (state, player: string) => {
        const test = state[player];

        return {
            ...state,
            [player]: test && {
                ...test,
                test: test?.test as number + 1,
            }
        }
    }
});
