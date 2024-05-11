import { HealthState } from "./health";

export interface SaveablePlayerData {
	readonly health: PlayerHealth;
}

export interface PlayerData {
	readonly health: PlayerHealth;
}

export type PlayerHealth = {
	readonly current: number;
	readonly max: number;
	readonly regenAmount: number;
	readonly regenRate: number;
	readonly regenCD: number;
};

export type PlayerState = HealthState;
