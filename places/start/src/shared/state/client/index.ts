import { InferState, combineProducers } from "@rbxts/reflex";
import { slices as sharedSlices } from "shared/state/shared/slices";
import { slices as clientSlices } from "./slices";
import { receiverMiddleware } from "./middleware/receiver";
import { RunService } from "@rbxts/services";

export type RootProducer = typeof store;
export type RootState = InferState<RootProducer>;

export const store = combineProducers({
	...sharedSlices,
	...clientSlices,
});

if (!RunService.IsServer()) {
	store.applyMiddleware(receiverMiddleware());
}
