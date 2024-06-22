import { SharedState } from "../../slices";

export const selectPlayerLedgeInfo = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.ledgeInfo[playerId];
	};
};
