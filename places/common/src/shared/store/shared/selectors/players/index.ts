import { createSelector } from "@rbxts/reflex";
import { SaveablePlayerData } from "../../slices/players";
import { SharedState } from "../../slices";

export const selectPlayerHealth = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.health[playerId];
	};
};

export const selectPlayerAnimation = (state: SharedState) => {
	return state.players.animation;
}

export const selectPlayerData = (playerId: string) => {
	return createSelector(selectPlayerHealth(playerId), (health): SaveablePlayerData | undefined => {
		if (!health) {
			return;
		}

		return { health };
	});
};
