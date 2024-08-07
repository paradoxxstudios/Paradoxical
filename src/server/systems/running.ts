import { World } from "@rbxts/matter";
import { Model, Running } from "shared/ecs/components";

function running(world: World) {
	for (const [id, record] of world.queryChanged(Running)) {
		const humanoid = world.get(id, Model)?.humanoid as Humanoid;
		if (record.old === undefined) {
			humanoid.WalkSpeed = 24;
		} else if (record.new === undefined) {
			humanoid.WalkSpeed = 16;
		}
	}
}

export = running;
