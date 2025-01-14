import { Component, component } from "@rbxts/matter";
import { transform, health } from "./defaults";
import type {
	Players as PlayerComponent,
	Model as ModelComponent,
	Transform as TransformComponent,
	Health as HealthComponent,
	Crouching as CrouchingComponent,
	Running as RunningComponent,
	LedgeHold as LedgeHoldComponent,
	Dashing as DashingComponent,
} from "./types";

export type ComponentType =
	| PlayerComponent
	| ModelComponent
	| TransformComponent
	| HealthComponent
	| CrouchingComponent
	| RunningComponent
	| LedgeHoldComponent
	| DashingComponent;
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

export const Crouching = component<CrouchingComponent>("Crouching");
export const Running = component<RunningComponent>("Running");
export const LedgeHold = component<LedgeHoldComponent>("LedgeHold");
export const Dashing = component<DashingComponent>("Dashing");
