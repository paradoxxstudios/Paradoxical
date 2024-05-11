import { World } from "@rbxts/matter";
import { Model } from "shared/ecs/components";

function playAnimations(world: World) {
	for (const [id, model] of world.query(Model)) {
		//
	}
}

export = playAnimations;
