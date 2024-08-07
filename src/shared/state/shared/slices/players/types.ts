import { AnimationState } from "./animation";
import { AnimationIdState } from "./animationIds";
import { HealthState } from "./health";
import { LedgeInfoState } from "./ledgeInfo";

export interface SaveablePlayerData {
	readonly health: PlayerHealth;
}

export interface PlayerData {
	readonly health: PlayerHealth;
	readonly animations: PlayerAnimations;
	readonly animationIds: PlayerAnimationIds;
	readonly ledgeInfo: PlayerLedgeInfo;
}

export type PlayerHealth = {
	readonly current: number;
	readonly max: number;
	readonly regenAmount: number;
	readonly regenRate: number;
	readonly regenCD: number;
};

export type AnimationKeys = keyof PlayerAnimationIds;

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

export type PlayerAnimationIds = {
	readonly idle: number;
	readonly walk: number;
	readonly run: number;
	readonly jump: number;
	readonly land: number;
};

export type PlayerLedgeInfo = {
	readonly jumped: boolean;
	readonly moveDirection?: number;
	readonly canVault: boolean;
	readonly ledgeMoveAmount: number;
	readonly raycastParams?: RaycastParams;
};

export type PlayerState = HealthState | AnimationState | AnimationIdState | LedgeInfoState;
