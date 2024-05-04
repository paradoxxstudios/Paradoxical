import { combineProducers } from "@rbxts/reflex";
import { healthSlice } from "./health";

export * from "./health";
export * from "./types";
export * from "./utils";

export const playersSlice = combineProducers({
	health: healthSlice,
});
