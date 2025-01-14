import { AnyEntity, World } from "@rbxts/matter";
import * as Components from "./components";
import { RootProducer } from "../../shared/store/client";
import { matterReplication } from "shared/net";
import { StateType } from "./types";

type ComponentNames = keyof typeof Components;
type ComponentConstructors = (typeof Components)[ComponentNames];

const DEBUG_SPAWN = "Spawn %ds%d with %s";
const DEBUG_DESPAWN = "Despawn %ds%d";
const DEBUG_MODIFY = "Modify %ds%d adding %s, removing %s";

/**
 * Starts the replication receiver.
 *
 * @param world - The world to replicate components in
 * @param state - The global state for the ECS
 */
function recieveReplication(world: World, state: StateType): void {
	function debugPrint(message: string, args: () => (string | number)[]): void {
		if ((state.reflex as RootProducer).getState().debugEnabled.enabled) {
			print("ECS Replication>", string.format(message, ...args()));
		}
	}

	const serverToClientEntity = new Map<string, AnyEntity>();

	matterReplication.replication.listen((entities) => {
		for (const [serverId, componentMap] of entities) {
			const clientId = serverToClientEntity.get(serverId);

			if (clientId !== undefined && next(componentMap)[0] === undefined) {
				world.despawn(clientId);
				serverToClientEntity.delete(serverId);
				debugPrint(DEBUG_DESPAWN, () => [clientId, serverId]);
				continue;
			}

			const componentsToInsert: Components.GameComponent[] = [];
			const componentsToRemove: ComponentConstructors[] = [];
			const insertNames: ComponentNames[] = [];
			const removeNames: ComponentNames[] = [];

			for (const [name, container] of componentMap as unknown as Map<
				ComponentNames,
				{ data: Components.GameComponent }
			>) {
				const component = Components[name];
				if (container.data !== undefined) {
					componentsToInsert.push(component(container.data as UnionToIntersection<Components.GameComponent>));
					insertNames.push(name);
				} else {
					componentsToRemove.push(component);
					removeNames.push(name);
				}
			}

			if (clientId === undefined) {
				const clientId = world.spawnAt(tonumber(serverId) as number, ...componentsToInsert);
				serverToClientEntity.set(serverId, clientId);
				debugPrint(DEBUG_SPAWN, () => [clientId, serverId, insertNames.join(",")]);
			} else {
				if (componentsToInsert.size() > 0) {
					world.insert(clientId, ...componentsToInsert);
				}

				if (componentsToRemove.size() > 0) {
					world.remove(clientId, ...componentsToRemove);
				}

				debugPrint(DEBUG_MODIFY, () => [
					clientId,
					serverId,
					insertNames.size() > 0 ? insertNames.join(", ") : "nothing",
					removeNames.size() > 0 ? removeNames.join(", ") : "nothing",
				]);
			}
		}
	});
}

export = recieveReplication;
