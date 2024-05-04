import { createBroadcastReceiver } from "@rbxts/reflex";
import Net from "@rbxts/yetanothernet";
import { reflexReplication } from "shared/routes";

export function receiverMiddleware() {
	const receiver = createBroadcastReceiver({
		start: async () => {
			return reflexReplication.start.send().to(Net.server);
		},
	});

	for (const [_pos, _sender, actions] of reflexReplication.broadcast.query()) {
		receiver.dispatch(actions);
	}

	return receiver.middleware;
}
