import { AnyComponent, AnyEntity, World, useEvent } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { DocumentType, beforeSave, collection, documents, loadData } from "server/datastore";
import { Model, Transform } from "shared/ecs/components";

function playerData(world: World) {
	for (const player of Players.GetPlayers()) {
		if (!world.contains(player.UserId)) {
			const id = world.spawnAt(player.UserId);
			collection
				.load(`Player${player.UserId}`, [player.UserId])
				.andThen((document: DocumentType): void => {
					if (player.Parent === undefined) {
						document.close().catch(warn);
					} else {
						loadData(world, id as AnyEntity, document);
						documents.set(player, document);
						document.beforeSave(() => beforeSave(document, world, id));
					}
				})
				.catch((message) => {
					warn(`Player ${player.Name}'s data failed to load: ${message}`);
					player.Kick(
						"Data failed to load, please try again. If issue persists, please report to developers.",
					);
				});
		} else {
			for (const [_, character] of useEvent(player, "CharacterAdded")) {
				if (!world.contains(player.UserId)) continue;
				world.insert(player.UserId, Model({ model: character }));
				world.insert(player.UserId, Transform());
			}
		}
	}

	for (const [_, player] of useEvent(Players, "PlayerRemoving")) {
		const document = documents.get(player);

		if (document !== undefined) {
			documents.delete(player);
			document.close().catch(warn);
			world.despawn(player.UserId);
		}
	}
}

export = playerData;
