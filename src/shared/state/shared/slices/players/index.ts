import { combineProducers } from "@rbxts/reflex";
import { healthSlice } from "./health";
import { animationSlice } from "./animation";
import { animationIdSlice } from "./animationIds";
import { ledgeInfoSlice } from "./ledgeInfo";

export * from "./health";
export * from "./animation";
export * from "./animationIds";
export * from "./ledgeInfo";
export * from "./types";
export * from "./utils";

export const playersSlice = combineProducers({
	health: healthSlice,
	animation: animationSlice,
	animationId: animationIdSlice,
	ledgeInfo: ledgeInfoSlice,
});
