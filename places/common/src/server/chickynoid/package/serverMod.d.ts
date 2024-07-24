import { ChickynoidServer } from "./chickynoidServer";
import PlayerRecord from "./playerRecord";

export interface ServerMod {
	GetPriority?(): number;

	Step(server: typeof ChickynoidServer, deltaTime: number): void;

	Setup(server: typeof ChickynoidServer): void;

	CanPlayerSee?(sourcePlayer: PlayerRecord, otherPlayer: PlayerRecord): boolean;
}
