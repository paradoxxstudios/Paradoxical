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

	toggleJumped: (state, player: string) => {
		const ledgeInfo = state[player];

		return {
			...state,
			[player]: ledgeInfo && {
				...ledgeInfo,
				jumped: !ledgeInfo.jumped,
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

	changeMoveDirection: (state, player: string, value: number) => {
		const ledgeInfo = state[player];

		return {
			...state,
			[player]: ledgeInfo && {
				...ledgeInfo,
				moveDirection: value,
			},
		};
	},

	changeRaycastParams: (state, player: string, raycastParams: RaycastParams) => {
		const ledgeInfo = state[player];

		return {
			...state,
			[player]: ledgeInfo && {
				...ledgeInfo,
				raycastParams: raycastParams,
			},
		};
	},
});
