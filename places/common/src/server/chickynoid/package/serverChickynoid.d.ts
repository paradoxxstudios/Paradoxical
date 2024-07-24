import Signal from "@rbxts/signal";
import { ChickynoidServer } from "./chickynoidServer";
import Simulation from "first/chickynoid/package/shared/simulation/simulation";
import PlayerRecord from "./playerRecord";

interface ServerChickynoid {
	playerRecord: PlayerRecord;
	hitBox: Part;
	simulation: Simulation;
	bufferedCommandTime: number;

	smoothFactor: number;

	hitBoxCreated: Signal<(hitBox: Part) => void>;

	SetPosition(position: Vector3, teleport: boolean): void;
	GetPosition(): Vector3;

	HandleEvent(server: typeof ChickynoidServer, event: unknown): void;

	Destroy(): void;
}

interface ServerChickynoidConstructor {
	/**
	 * Constructed internally. Do not use directly.
	 * @private
	 */
	new(): ServerChickynoid;
}

declare const ServerChickynoid: ServerChickynoidConstructor;
export = ServerChickynoid;
