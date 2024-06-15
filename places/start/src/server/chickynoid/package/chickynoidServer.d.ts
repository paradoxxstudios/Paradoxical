import Signal from "@rbxts/signal";
import PlayerRecord from "./playerRecord";

/** @server */
export namespace ChickynoidServer {
	export interface ServerConfig {
		/** Theoretical max, use a byte for player id */
		maxPlayers: number;
		fpsMode: FpsMode;
		serverHz: number;
		antiWarp: boolean;
	}

	export const enum FpsMode {
		Uncapped,
		Hybrid,
		Fixed60,
	}

	export let config: ServerConfig;
	export const playerRecords: Map<number, PlayerRecord>;
	export const startTime: number;
	export const slots: number[];
	export const serverStepTimer: number;
	export const serverSimulationTime: number;
	export const framesPerSecond: number;
	export const accumulatedTime: number;
	export const playerSize: Vector3;
	export const flags: {
		DEBUG_ANTILAG: boolean;
	};

	export const OnPlayerSpawn: Signal<(playerRecord: PlayerRecord) => void>;
	export const OnPlayerDespawn: Signal<(playerRecord: PlayerRecord) => void>;
	export const OnBeforePlayerSpawn: Signal<(playerRecord: PlayerRecord) => void>;
	export const OnPlayerConnected: Signal<(server: typeof ChickynoidServer, playerRecord: PlayerRecord) => void>; // FIXME: This type is cursed

	/** Creates connections so that Chickynoid can run on the server. */
	export function Setup(this: typeof ChickynoidServer): void;

	export function RecreateCollisions(this: typeof ChickynoidServer, root: Instance): void;

	export function GetPlayerByUserId(this: typeof ChickynoidServer, userId: number): PlayerRecord | undefined;

	export function GetPlayers(this: typeof ChickynoidServer): Map<number, PlayerRecord>;

	export function RegisterMod(this: typeof ChickynoidServer, mod: ModuleScript): void;

	export function AddConnection(
		this: typeof ChickynoidServer,
		userId: number,
		player: Player | undefined,
	): PlayerRecord;
}

export { Antilag } from "./antiLag";
export { ServerMods } from "./serverMods";
