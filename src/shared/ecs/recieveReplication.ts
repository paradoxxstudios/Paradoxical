import { AnyEntity, World } from "@rbxts/matter";
import * as Components from "./components";
import { RootProducer } from "shared/state/client";
import { matterReplication } from "shared/net";
import { Players } from "@rbxts/services";

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
function recieveReplication(world: World, state: RootProducer): void {
	function debugPrint(message: string, args: () => (string | number)[]): void {
		if (state.getState().debugEnabled.enabled) {
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
				// eslint-disable-next-line roblox-ts/lua-truthiness
				if (container.data) {
					componentsToInsert.push(
						// The type of component above is an intersection of all possible
						// component types since it can't know which specific component is
						// associated with the name. Therefore here, we must cast to an
						// intersection so that the data can be used.
						//
						// This is okay because the data must be associated with the name
						// it was created with, but the type checker can't verify this for
						// us. To solve this the type must somehow be associated with the
						// name in the type system. For now, this cast works fine.
						component(container.data as UnionToIntersection<Components.GameComponent>),
					);
					insertNames.push(name);
				} else {
					componentsToRemove.push(component);
					removeNames.push(name);
				}
			}

			if (clientId === undefined) {
				const clientId = world.spawn(...componentsToInsert);
				serverToClientEntity.set(serverId, clientId);
				debugPrint(DEBUG_SPAWN, () => [clientId, serverId, insertNames.join(",")]);
			} else {
				if (componentsToInsert.size() > 0) {
					world.replace(clientId, ...componentsToInsert);
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
