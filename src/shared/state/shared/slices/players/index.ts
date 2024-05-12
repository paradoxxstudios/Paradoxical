import { combineProducers } from "@rbxts/reflex";
import { healthSlice } from "./health";
import { animationSlice } from "./animation";

export * from "./health";
export * from "./animation";
export * from "./types";
export * from "./utils";

export const playersSlice = combineProducers({
	health: healthSlice,
	animation: animationSlice,
});
