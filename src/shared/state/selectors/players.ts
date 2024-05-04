import { createSelector } from "@rbxts/reflex";
import { SharedState } from "shared/state/slices";
import { PlayerData } from "shared/state/slices/players";

export const selectPlayerHealth = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.health[playerId];
	};
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(selectPlayerHealth(playerId), (health): PlayerData | undefined => {
		if (!health) {
			return;
		}

		return { health };
	});
};
