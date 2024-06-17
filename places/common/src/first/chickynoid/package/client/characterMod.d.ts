import Simulation from "../shared/simulation/simulation";

export interface CharacterMod {
	Setup(simulation: Simulation): void;
	GetCharacterModel(userId: number): Model | undefined;
}
