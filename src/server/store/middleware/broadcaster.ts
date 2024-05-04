import { createBroadcaster } from "@rbxts/reflex";
import { reflexReplication } from "shared/routes";
import { slices } from "shared/state/shared/slices";

export function broadcasterMiddleware() {
	const broadcaster = createBroadcaster({
		producers: slices,
		dispatch: async (player, actions) => {
			reflexReplication.broadcast.send(actions).to(player);
		},
	});

	for (const [_pos, player] of reflexReplication.start.query()) {
		return broadcaster.start(player as Player);
	}

	return broadcaster.middleware;
}
