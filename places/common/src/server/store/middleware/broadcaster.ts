import { createBroadcaster } from "@rbxts/reflex";
import { server } from "../../../shared/state/remotes";
import { slices } from "../../../shared/state/shared/slices";

export function broadcasterMiddleware() {
	const broadcaster = createBroadcaster({
		producers: slices,
		dispatch: async (player, actions) => {
			server.Get("broadcast").SendToPlayer(player, actions);
		},
		beforeHydrate: (player, state) => {
			const userId = tostring(player.UserId);
			const players: { [index: string]: { [index: string]: unknown } } = {};
			for (const [name, playerState] of pairs(state.players)) {
				if (players[name] === undefined) players[name] = {};
				players[name][userId] = playerState[userId];
			}
			return {
				...state,
				players: players as typeof state.players,
			};
		},
	});

	server.OnEvent("start", (player) => {
		return broadcaster.start(player);
	});

	return broadcaster.middleware;
}
