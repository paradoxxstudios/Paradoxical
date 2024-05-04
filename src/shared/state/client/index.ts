import { InferState, combineProducers, loggerMiddleware } from "@rbxts/reflex";
import { slices } from "shared/state/shared/slices";
import { slices as clientSlices } from "./slices";
import { receiverMiddleware } from "./middleware/receiver";

export type RootProducer = typeof store;
export type RootState = InferState<RootProducer>;

export const store = combineProducers({
	...slices,
	...clientSlices,
});

store.applyMiddleware(receiverMiddleware(), loggerMiddleware);
