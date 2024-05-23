import { t } from "@rbxts/t";
import { commands } from "shared/net";
import { store } from "./store";

commands.handleCommands.listen((data, player) => {
	assert(t.number(data), "Data is not a number");
	if (player === undefined) return;
	const userId = tostring(player.UserId);
	if (store.getState().players.animationId[userId]?.idle === 14385447903) {
		store.changeAnimationId(userId, "walk", 15239128607);
		store.changeAnimationId(userId, "idle", 15239153655);
	} else {
		store.changeAnimationId(userId, "walk", 14385484112);
		store.changeAnimationId(userId, "idle", 14385447903);
	}
});
