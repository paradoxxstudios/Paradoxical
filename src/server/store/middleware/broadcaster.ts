import { createBroadcaster } from "@rbxts/reflex";
import { server } from "shared/state/remotes";
import { slices } from "shared/state/shared/slices";

export function broadcasterMiddleware() {
	const broadcaster = createBroadcaster({
		producers: slices,
		dispatch: async (player, actions) => {
			server.Get("broadcast").SendToPlayer(player, actions);
		},
		beforeDispatch: (player, action) => {
			if (action.arguments[0] !== player.UserId) {
				return;
			}
			return action;
		},
	});

	server.OnEvent("start", (player) => {
		return broadcaster.start(player);
	});

	return broadcaster.middleware;
}
