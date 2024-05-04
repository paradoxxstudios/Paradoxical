import { CombineStates, InferState, ProducerMiddleware, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/state/shared/slices";
import { broadcasterMiddleware } from "./middleware/broadcaster";

export type RootState = InferState<typeof store>;

export const store = combineProducers({
	...slices,
});

store.applyMiddleware(broadcasterMiddleware() as ProducerMiddleware<CombineStates<{}>, unknown>);
