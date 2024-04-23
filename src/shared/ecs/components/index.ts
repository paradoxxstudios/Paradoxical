import { Component, component } from "@rbxts/matter";
import { transform } from "./defaults";
// eslint-disable-next-line prettier/prettier
import type {
	Model as ModelComponent,
	Transform as TransformComponent,
} from "./types";

// eslint-disable-next-line prettier/prettier
export type ComponentType =
	| ModelComponent
	| TransformComponent;
export type GameComponent = Component<ComponentType>;

/**
 * The {@link ModelComponent | Model} component constructor.
 */
export const Model = component<ModelComponent>("Model");

/**
 * The {@link TransformComponent | Transform} component constructor.
 */
export const Transform = component<TransformComponent>("Transform", transform);

/**
 * This is a test component constructor.
 *
 * It shouldn't be used and should be removed at some point.
 */
export const Test = component("Test");
