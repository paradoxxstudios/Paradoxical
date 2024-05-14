import { createSelector } from "@rbxts/reflex";
import { SharedState } from "shared/state/shared/slices";
import { SaveablePlayerData } from "shared/state/shared/slices/players";

export const selectPlayerHealth = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.health[playerId];
	};
};

export const selectPlayerAnimation = (state: SharedState) => {
	return state.players.animation;
}

export const selectPlayerAnimationIds = (playerId: string) => {
	const selectAnimationIds = (state: SharedState) => {
		return state.players.animation[playerId]?.animationIds;
	};

	return createSelector(selectAnimationIds, (animationIds) => {
		return animationIds;
	});
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(selectPlayerHealth(playerId), (health): SaveablePlayerData | undefined => {
		if (!health) {
			return;
		}

		return { health };
	});
};
