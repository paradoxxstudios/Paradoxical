import { combineProducers, InferState } from "@rbxts/reflex";

export type RootStore = typeof store;

export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({});

	return store;
}

export const store = createStore();
