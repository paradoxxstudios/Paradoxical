import { createBroadcastReceiver } from "@rbxts/reflex";
import { client } from "shared/state/remotes";

export function receiverMiddleware() {
	const receiver = createBroadcastReceiver({
		start: async () => {
			return client.Get("start").SendToServer();
		},
	});

	client.OnEvent("broadcast", (actions) => {
		print(actions);
		receiver.dispatch(actions);
	});

	return receiver.middleware;
}
