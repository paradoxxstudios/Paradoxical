import { useEvent, World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { Model } from "shared/ecs/components";
import { coreCallback } from "shared/net";

/**
 * A system that removes missing {@link Model | Models}.
 *
 * If a model is removed from the game, this system will remove the
 * corresponding model from the world.
 *
 * If a model is removed from the world, this system will remove the
 * corresponding model from the game.
 */
function removeMissingModels(world: World): void {
	for (const [id, model] of world.query(Model)) {
		if (!model.model) continue;
		for (const _ of useEvent(model.model, "AncestryChanged")) {
			if (!model.model.IsDescendantOf(game)) {
				world.remove(id, Model);
				coreCallback.resetCallback.sendTo(undefined, Players.GetPlayerByUserId(id) as Player);
				break;
			}
		}
	}

	for (const [_, record] of world.queryChanged(Model)) {
		if (record.new) continue;
		record.old?.model?.Destroy();
	}
}

export = removeMissingModels;
