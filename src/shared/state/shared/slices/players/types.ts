import { AnimationState } from "./animation";
import { HealthState } from "./health";

export interface SaveablePlayerData {
	readonly health: PlayerHealth;
}

export interface PlayerData {
	readonly health: PlayerHealth;
	readonly animations: PlayerAnimations;
}

export type PlayerHealth = {
	readonly current: number;
	readonly max: number;
	readonly regenAmount: number;
	readonly regenRate: number;
	readonly regenCD: number;
};

export type PlayerAnimations = {
	readonly playingAnimations: AnimationTrack[];
	readonly idle?: AnimationTrack;
	readonly walk?: AnimationTrack;
	readonly run?: AnimationTrack;
	readonly jump?: AnimationTrack;
	readonly land?: AnimationTrack;
	readonly jumpAnimTime: number;
	readonly freefalling: boolean;
};

export type AnimationKeys = keyof PlayerAnimations;

export type PlayerState = HealthState | AnimationState;
