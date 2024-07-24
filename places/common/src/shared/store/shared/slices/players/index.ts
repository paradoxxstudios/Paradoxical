import { combineProducers } from "@rbxts/reflex";
import { healthSlice } from "./health";
import { animationSlice } from "./animation";
import { ledgeInfoSlice } from "./ledgeInfo";
import { test } from "./test";

export * from "./health";
export * from "./animation";
export * from "./ledgeInfo";
export * from "./types";
export * from "./utils";
export * from "./test";

export const playersSlice = combineProducers({
	health: healthSlice,
	animation: animationSlice,
	ledgeInfo: ledgeInfoSlice,
	test: test,
});
