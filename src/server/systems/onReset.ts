import { World } from "@rbxts/matter";
import { Model } from "shared/ecs/components";
import useBytenet from "shared/hooks/useBytenet";
import { coreCallback } from "shared/net";

function onReset(world: World) {
	for (const [_, __, player] of useBytenet("reset", coreCallback.resetCallback)) {
		if (player === undefined) continue;
		const model = world.get(player.UserId, Model);
		const humanoid = model?.humanoid as Humanoid;

		humanoid.Health = humanoid.Health * 0.1;
	}
}

export = onReset;
