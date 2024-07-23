import { World } from "@rbxts/matter";
import { Crouching, Model } from "shared/ecs/components";
import { tweenFOV } from "shared/utils/tween/camera";
import { Workspace } from "@rbxts/services";
import { tween } from "shared/utils/tween/tween";

function crouching(world: World) {
	for (const [id, record] of world.queryChanged(Crouching)) {
		const camera = Workspace.CurrentCamera;
		if (!camera) continue;

		const humanoid = world.get(id, Model)?.humanoid as Humanoid;
		if (record.old === undefined) {
			tweenFOV(camera, 40, 0.3, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
			tween(humanoid, { CameraOffset: Vector3.yAxis }, 0.3);
		} else if (record.new === undefined) {
			tweenFOV(camera, 70, 0.3, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
			tween(humanoid, { CameraOffset: Vector3.zero }, 0.3);
		}
	}
}

export = crouching;
