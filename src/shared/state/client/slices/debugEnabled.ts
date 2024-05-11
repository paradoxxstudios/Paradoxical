import { createProducer } from "@rbxts/reflex";

export interface debugEnabled {
	readonly enabled: boolean;
}

const initialState: debugEnabled = {
	enabled: false,
};

export const debugEnabled = createProducer(initialState, {
	toggle: (state) => ({
		...state,
		enabled: !state.enabled,
	}),
});
