import { World, useEvent } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { Model, Player, Transform } from "shared/ecs/components";

function spawnPlayers(world: World) {
	for (const player of Players.GetPlayers()) {
		for (const [_id, character] of useEvent(player, "CharacterAdded")) {
			character.PrimaryPart = character.FindFirstChild("HumanoidRootPart") as BasePart;

			if (world.contains(player.UserId)) {
				world.insert(
					player.UserId,
					Model({
						model: character,
						humanoid: character.FindFirstChildOfClass("Humanoid"),
						humanoidRootPart: character.PrimaryPart,
					}),
					Transform(),
				);
			} else {
				world.spawnAt(
					player.UserId,
					Model({
						model: character,
						humanoid: character.FindFirstChildOfClass("Humanoid"),
						humanoidRootPart: character.PrimaryPart,
					}),
					Transform(),
					Player({ player: player }),
				);
			}
		}
	}
}

export = spawnPlayers;
