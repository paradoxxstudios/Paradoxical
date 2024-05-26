import { World } from "@rbxts/matter";
import { Crouching, Player } from "shared/ecs/components";
import { tweenFOV } from "shared/utils/camera";
import { Workspace } from "@rbxts/services";

function crouching(world: World) {
	for (const [_, record] of world.queryChanged(Crouching)) {
		const camera = Workspace.CurrentCamera;
		if (!camera) continue;

		if (record.old === undefined) {
			tweenFOV(camera, 60, 0.5, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		} else if (record.new === undefined) {
			tweenFOV(camera, 70, 0.5, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		}
	}
}

export = crouching;
