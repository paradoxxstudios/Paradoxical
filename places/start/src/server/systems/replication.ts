import { useEvent, World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { matterReplication } from "shared/net";
import * as Components from "shared/ecs/components";

type ComponentName = keyof typeof Components;
type ComponentConstructor = (typeof Components)[ComponentName];

const REPLICATED_COMPONENT_NAMES: readonly ComponentName[] = ["Model", "Crouching", "Running", "Player"];

const replicatedComponents: ReadonlySet<ComponentConstructor> = REPLICATED_COMPONENT_NAMES.reduce(
	(set: Set<ComponentConstructor>, name: ComponentName) => {
		return set.add(Components[name]);
	},
	new Set(),
);

type Data = Map<string, Map<ComponentName, { data?: Components.GameComponent }>>;

function filterPlayer(player: Player, data: Data) {
	const filterdChanges = table.clone(data);
	for (const [entity, _] of data) {
		if (tostring(player.UserId) === entity) continue;

		const entityPlayer = Players.GetPlayerByUserId(tonumber(entity) as number);
		if (entityPlayer === undefined) continue;

		if (Players.GetPlayers().includes(entityPlayer)) {
			filterdChanges.delete(entity);
		}
	}

	matterReplication.replication.sendTo(
		filterdChanges as Map<
			string,
			Map<
				string,
				{
					data: Map<string, unknown> | undefined;
				}
			>
		>,
		player,
	);
}

function replication(world: World): void {
	let payload: Data | undefined;
	for (const [_, player] of useEvent(Players, "PlayerAdded")) {
		if (!payload) {
			payload = new Map();

			for (const [id, entityData] of world) {
				const entityPayload: Map<ComponentName, { data?: Components.GameComponent }> = new Map();
				payload.set(tostring(id), entityPayload);

				for (const [component, componentData] of entityData) {
					if (replicatedComponents.has(component)) {
						// Here we are certain that the component has the name of one of our
						// components because it exists in our set of components.
						entityPayload.set(tostring(component) as ComponentName, { data: componentData });
					}
				}
			}
		}

		print("Sending initial payload to", player);
		filterPlayer(player, payload);
	}

	const changes: Data = new Map();
	for (const component of replicatedComponents) {
		// Here we are certain that the component has the name of one of our
		// components since it came from our set.
		const name = tostring(component) as ComponentName;

		for (const [id, record] of world.queryChanged(component)) {
			const key = tostring(id);

			if (!changes.has(key)) {
				changes.set(key, new Map());
			}

			if (world.contains(id)) {
				changes.get(key)?.set(name, { data: record.new });
			}
		}
	}

	if (changes.size() === 0) return;
	for (const player of Players.GetPlayers()) {
		filterPlayer(player, changes);
	}
}

/**
 * A system that replicates all replicated components to the client.
 *
 * This system runs after after all other systems to ensure any changes made are
 * included.
 */
export = {
	system: replication,
	priority: math.huge,
};
