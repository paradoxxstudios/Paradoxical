import { InferState, combineProducers, loggerMiddleware } from "@rbxts/reflex";
import { slices } from "shared/state/slices";
import { slices as clientSlices } from "./slices";
import { receiverMiddleware } from "./middleware/receiver";

export type RootState = InferState<typeof store>;

export const store = combineProducers({
	...slices,
	...clientSlices,
});

store.applyMiddleware(receiverMiddleware(), loggerMiddleware);
