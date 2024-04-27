import { createCollection, Document } from "@rbxts/lapis";
import { AnyEntity, World } from "@rbxts/matter";
import { AnyComponent, ComponentCtor } from "@rbxts/matter/lib/component";
import { t } from "@rbxts/t";
import { ComponentType, Health } from "shared/ecs/components";
import { VALIDATE } from "shared/ecs/components/validate";

export type DocumentType = Document<Map<string, AnyComponent>>;

// eslint-disable-next-line prettier/prettier
const COMPONENTS_TO_SAVE = new Map<string, ComponentCtor>([
	["health", Health],
]);

const defaultData = new Map<string, AnyComponent>();
for (const [key, component] of COMPONENTS_TO_SAVE) {
	defaultData.set(key, component());
}

export const collection = createCollection("PlayerData", {
	defaultData: defaultData,
	validate: t.strictInterface(VALIDATE),
});

export function beforeSave(document: DocumentType, world: World, id: AnyEntity) {
	const data = new Map<string, AnyComponent>();

	for (const [key, component] of COMPONENTS_TO_SAVE) {
		data.set(key, world.get(id, component) as AnyComponent);
	}

	document.write(data);
}

export function loadData(world: World, id: AnyEntity, document: DocumentType) {
	const data = document.read();
	for (const [key, comp] of COMPONENTS_TO_SAVE) {
		const componentData = data.get(key) as ComponentType;
		if (componentData) world.insert(id, comp().patch(componentData));
	}
}

export const documents = new Map<Player, DocumentType>();
