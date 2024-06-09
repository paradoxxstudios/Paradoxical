import { ChickynoidCommand } from "first/chickynoid/package/shared/simulation/command";
import Simulation from "first/chickynoid/package/shared/simulation/simulation";

export interface MoveType {
	ModifySimulation: (this: MoveType, simulation: Simulation) => void;
	ActiveThink: (simulation: Simulation, command: ChickynoidCommand) => void;
	AlwaysThink?: (simulation: Simulation, command: ChickynoidCommand) => void;
	StartState?: (simulation: Simulation, command: ChickynoidCommand) => void;
	EndState?: (simulation: Simulation, command: ChickynoidCommand) => void;
	AlwaysThinkLate?: (simlation: Simulation, command: ChickynoidCommand) => void;
}
