import { createSelector } from "@rbxts/reflex";
import { SharedState } from "shared/state/shared/slices";
import { SaveablePlayerData } from "shared/state/shared/slices/players";

export const selectPlayerHealth = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.health[playerId];
	};
};

export const selectPlayerAnimation = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.animation[playerId];
	};
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(selectPlayerHealth(playerId), (health): SaveablePlayerData | undefined => {
		if (!health) {
			return;
		}

		return { health };
	});
};
