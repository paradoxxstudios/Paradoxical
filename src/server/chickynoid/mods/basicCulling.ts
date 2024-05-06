import { ChickynoidServer } from "@rbxts/chickynoid/types/Server";
import PlayerRecord from "@rbxts/chickynoid/types/Server/PlayerRecord";

export function Setup(_server: typeof ChickynoidServer) {}

export function CanPlayerSee(sourcePlayer: PlayerRecord, otherPlayer: PlayerRecord) {
	if (sourcePlayer.chickynoid === undefined) {
		return true;
	}
	if (otherPlayer.chickynoid === undefined) {
		return true;
	}

	const posA = sourcePlayer.chickynoid.simulation.state.pos;
	const posB = otherPlayer.chickynoid.simulation.state.pos;

	return posA.sub(posB).Magnitude <= 350;
}
