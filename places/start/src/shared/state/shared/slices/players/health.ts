import { createProducer } from "@rbxts/reflex";
import { SaveablePlayerData, PlayerHealth } from "./types";

export interface HealthState {
	readonly [player: string]: PlayerHealth | undefined;
}

const initialState: HealthState = {};

export const healthSlice = createProducer(initialState, {
	loadPlayerHealth: (state, player: string, data: SaveablePlayerData) => ({
		...state,
		[player]: data.health,
	}),

	closePlayerHealth: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	changeHealthStat: (state, player: string, stat: keyof PlayerHealth, amount: number) => {
		const health = state[player];

		return {
			...state,
			[player]: health && {
				...health,
				[stat]: health[stat] + amount,
			},
		};
	},

	changeHealth: (state, player: string, stat: PlayerHealth) => {
		const health = state[player];

		return {
			...state,
			[player]: health && {
				...stat,
			},
		};
	},
});
