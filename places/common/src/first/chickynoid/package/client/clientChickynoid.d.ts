import CharacterData from "../shared/simulation/characterData";
import Simulation = require("../shared/simulation/simulation");

interface ClientChickynoid {
	simulation: Simulation;
	ping: number;

	GetPlayerDataByUserId(userId: number): CharacterData;
}

interface ClientChickynoidConstructor {
	/**
	 * Constructed internally. Do not use directly.
	 * @private
	 */
	new (): ClientChickynoid;

	GetCollisionRoot(): Instance;
	GetPlayerDataByUserId(userId: number): CharacterData;
	ping: number;
	simulation: Simulation;
}

declare const ClientChickynoid: ClientChickynoidConstructor;
export = ClientChickynoid;
