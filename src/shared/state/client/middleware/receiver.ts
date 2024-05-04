import { createBroadcastReceiver } from "@rbxts/reflex";
import { reflexReplication } from "shared/routes";

export function receiverMiddleware() {
	const receiver = createBroadcastReceiver({
		start: async () => {
			return reflexReplication.start.send();
		},
	});

	for (const [_pos, _sender, actions] of reflexReplication.broadcast.query()) {
		receiver.dispatch(actions);
	}

	return receiver.middleware;
}
