import { Component, component } from "@rbxts/matter";
// eslint-disable-next-line prettier/prettier
import { 
	transform,
	health,
} from "./defaults";
// eslint-disable-next-line prettier/prettier
import type {
	Players as PlayerComponent,
	Model as ModelComponent,
	Transform as TransformComponent,
	Health as HealthComponent,
} from "./types";

// eslint-disable-next-line prettier/prettier
export type ComponentType =
	| PlayerComponent
	| ModelComponent
	| TransformComponent
	| HealthComponent;
export type GameComponent = Component<ComponentType>;

/**
 * The {@link PlayerComponent | Player} component constructor.
 */
export const Player = component<PlayerComponent>("Player");

/**
 * The {@link ModelComponent | Model} component constructor.
 */
export const Model = component<ModelComponent>("Model");

/**
 * The {@link TransformComponent | Transform} component constructor.
 */
export const Transform = component<TransformComponent>("Transform", transform);

/**
 * The {@link HealthComponent | Health} component constructor.
 */
export const Health = component<HealthComponent>("Health", health);
