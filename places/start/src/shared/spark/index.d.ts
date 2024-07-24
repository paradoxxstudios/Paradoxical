import { Actions as SparkActions, InputMap, InputState } from "@rbxts/spark";
import { ActionKeys } from "./actions";

export class Actions<T> extends SparkActions<string[]> {
	constructor(actions: T);
	justPressed(action: ActionKeys): boolean;
	justReleased(action: ActionKeys): boolean;
}

export interface SparkState {
	inputState: InputState;
	actions: Actions<string[]>;
	inputMap: InputMap<Actions<string[]>>;
}

export const sparkState: SparkState;
