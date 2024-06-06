import { World } from "@rbxts/matter";
import { Running } from "shared/ecs/components";
import { tweenFOV } from "shared/utils/tween/camera";
import { Workspace } from "@rbxts/services";

function running(world: World) {
	for (const [_, record] of world.queryChanged(Running)) {
		const camera = Workspace.CurrentCamera;
		if (!camera) continue;

		if (record.old === undefined) {
			tweenFOV(camera, 90, 0.3, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		} else if (record.new === undefined) {
			tweenFOV(camera, 70, 0.3, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
		}
	}
}

export = running;
