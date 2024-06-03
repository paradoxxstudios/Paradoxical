import { World, useEvent } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { LedgeInfo, Model, Player, Transform } from "shared/ecs/components";

function spawnPlayers(world: World) {
	for (const player of Players.GetPlayers()) {
		for (const [_id, character] of useEvent(player, "CharacterAdded")) {
			const bodyParts = { head: character.PrimaryPart };
			character.PrimaryPart = character.FindFirstChild("HumanoidRootPart") as BasePart;

			const raycastParams = new RaycastParams();
			raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
			raycastParams.FilterDescendantsInstances = [character];

			if (world.contains(player.UserId)) {
				world.insert(
					player.UserId,
					Model({
						model: character,
						humanoid: character.FindFirstChildOfClass("Humanoid"),
						humanoidRootPart: character.PrimaryPart,
						bodyParts: bodyParts,
					}),
					Transform(),
					LedgeInfo().patch({ raycastParams: raycastParams }),
				);
			} else {
				world.spawnAt(
					player.UserId,
					Model({
						model: character,
						humanoid: character.FindFirstChildOfClass("Humanoid"),
						humanoidRootPart: character.PrimaryPart,
						bodyParts: bodyParts,
					}),
					Transform(),
					Player({ player: player }),
					LedgeInfo().patch({ raycastParams: raycastParams }),
				);
			}
		}
	}
}

export = spawnPlayers;
