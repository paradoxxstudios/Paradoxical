import { SharedState } from "../../slices";

export const selectPlayerAnimationIds = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.animationId[playerId];
	};
};

export const selectPlayerIdleId = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.animationId[playerId]?.idle;
	};
};

export const selectPlayerWalkId = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.animationId[playerId]?.walk;
	};
};

export const selectPlayerRunId = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.animationId[playerId]?.run;
	};
};

export const selectPlayerJumpId = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.animationId[playerId]?.jump;
	};
};

export const selectPlayerLandId = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.animationId[playerId]?.land;
	};
};
