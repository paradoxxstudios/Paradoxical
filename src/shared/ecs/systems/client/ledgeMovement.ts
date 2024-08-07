import { World } from "@rbxts/matter";
import { playerId } from "shared/constants";
import { Model } from "shared/ecs/components";
import useBytenet from "shared/hooks/useBytenet";
import { ledgeMovement as ledgeMovementNet } from "shared/net";

function ledgeMovement(world: World) {
	if (!world.contains(tonumber(playerId) as number)) return;
	const model = world.get(tonumber(playerId) as number, Model);
	const humanoid = model?.humanoid as Humanoid;

	for (const _ of useBytenet("jump", ledgeMovementNet.jump)) {
		humanoid.ChangeState("Jumping");
	}
}

export = ledgeMovement;
