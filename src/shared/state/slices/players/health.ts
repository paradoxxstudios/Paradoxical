import { createProducer } from "@rbxts/reflex";
import { PlayerData } from "./types";
import { Health } from "shared/ecs/components/types";

export interface HealthState {
	readonly [player: string]: Health | undefined;
}

const initialState: HealthState = {};

export const healthSlice = createProducer(initialState, {
	loadPlayerData: (state, player: string, data: PlayerData) => ({
		...state,
		[player]: data.health,
	}),

	closePlayerData: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	changeCurrent: (state, player: string, amount: number) => {
		const health = state[player];

		return {
			...state,
			[player]: health && {
				...health,
				current: math.max(0, health.current + amount),
			},
		};
	},
});
