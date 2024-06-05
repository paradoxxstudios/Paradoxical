import { createProducer } from "@rbxts/reflex";
import { PlayerLedgeInfo } from "./types";

export const defaultLedgeInfo: PlayerLedgeInfo = {
	jumped: false,
	canVault: true,
	ledgeMoveAmount: 15,
};

export interface LedgeInfoState {
	[player: string]: PlayerLedgeInfo | undefined;
}

const initialState: LedgeInfoState = {};

export const ledgeInfoSlice = createProducer(initialState, {
	loadLedgeInfoPlayer: (state, player: string) => ({
		...state,
		[player]: defaultLedgeInfo,
	}),

	closeLedgeInfoPlayer: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	changeJumped: (state, player: string, value: boolean) => {
		const ledgeInfo = state[player];

		return {
			...state,
			[player]: ledgeInfo && {
				...ledgeInfo,
				jumped: value,
			},
		};
	},

	changeCanVault: (state, player: string, value: boolean) => {
		const ledgeInfo = state[player];

		return {
			...state,
			[player]: ledgeInfo && {
				...ledgeInfo,
				canVault: value,
			},
		};
	},
});
