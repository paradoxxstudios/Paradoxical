import { World, useEvent } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { RootProducer } from "../../shared/state/client";
import { Model, Player, Transform } from "shared/ecs/components";
import { StateType } from "shared/ecs/types";

function spawnPlayers(world: World, state: StateType) {
	const reflexState = state.reflex as RootProducer;

	for (const player of Players.GetPlayers()) {
		for (const [_id, character] of useEvent(player, "CharacterAdded")) {
			const bodyParts = { head: character.PrimaryPart };
			character.PrimaryPart = character.FindFirstChild("HumanoidRootPart") as BasePart;

			const raycastParams = new RaycastParams();
			raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
			raycastParams.FilterDescendantsInstances = [character];

			if (world.contains(player.UserId)) {
				reflexState.changeRaycastParams(player.UserId + "", raycastParams);
				world.insert(
					player.UserId,
					Model({
						model: character,
						humanoid: character.FindFirstChildOfClass("Humanoid"),
						humanoidRootPart: character.PrimaryPart,
						bodyParts: bodyParts,
					}),
					Transform(),
				);
			} else {
				reflexState.changeRaycastParams(player.UserId + "", raycastParams);
				world.spawnAt(
					player.UserId,
					Model({
						model: character,
						humanoid: character.FindFirstChildOfClass("Humanoid"),
						humanoidRootPart: character.PrimaryPart,
						bodyParts: bodyParts,
					}),
					Transform(),
					Player({ player: player, stringId: player.UserId + "", numId: player.UserId }),
				);
			}
		}
	}
}

export = spawnPlayers;
