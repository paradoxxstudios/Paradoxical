import { InferState, combineProducers, loggerMiddleware } from "@rbxts/reflex";
import { slices as sharedSlices } from "shared/state/shared/slices";
import { slices as serverSlices } from "./slices";
import { broadcasterMiddleware } from "./middleware/broadcaster";

export type RootProducer = typeof store;
export type RootState = InferState<RootProducer>;

export const store = combineProducers({
	...sharedSlices,
	...serverSlices,
});

store.applyMiddleware(broadcasterMiddleware());
