import { World, useEvent } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { Model, Transform } from "shared/ecs/components";

function spawnPlayers(world: World) {
	for (const player of Players.GetPlayers()) {
		for (const [_id, character] of useEvent(player, "CharacterAdded")) {
			world.spawnAt(player.UserId, Model({ model: character }), Transform());
		}
	}
}

export = spawnPlayers;
