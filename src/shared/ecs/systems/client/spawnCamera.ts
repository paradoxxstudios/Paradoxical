import { World } from "@rbxts/matter";
import { Workspace } from "@rbxts/services";
import { Player } from "shared/ecs/components";

function spawnCamera(world: World) {
	for (const [id, player] of world.query(Player)) {
		const camera = Workspace.CurrentCamera;
		if (player.camera) continue;
		world.insert(id, player.patch({ camera: camera }));
	}
}

export = spawnCamera;
