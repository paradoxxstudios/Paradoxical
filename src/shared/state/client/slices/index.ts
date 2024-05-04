import { CombineStates } from "@rbxts/reflex";
import { debugEnabled } from "./debugEnabled";
import { currentPose } from "./currentPose";

export type ClientState = CombineStates<typeof slices>;

export const slices = {
	debugEnabled: debugEnabled,
	currentPose: currentPose,
};
