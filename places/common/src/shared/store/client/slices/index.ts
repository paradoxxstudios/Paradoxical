import { CombineStates } from "@rbxts/reflex";
import { debugEnabled } from "./debugEnabled";

export type ClientState = CombineStates<typeof slices>;

export const slices = {
	debugEnabled: debugEnabled,
};
