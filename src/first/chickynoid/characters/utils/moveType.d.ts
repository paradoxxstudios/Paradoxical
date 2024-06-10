import Simulation from "first/chickynoid/package/shared/simulation/simulation";
import { Commands } from "first/chickynoid/package/shared/vendor/crunchTable";

export interface MoveType {
	ModifySimulation: (this: MoveType, simulation: Simulation) => void;
	ActiveThink: (simulation: Simulation, command: Commands) => void;
	AlwaysThink?: (simulation: Simulation, command: Commands) => void;
	StartState?: (simulation: Simulation, command: Commands) => void;
	EndState?: (simulation: Simulation, command: Commands) => void;
	AlwaysThinkLate?: (simlation: Simulation, command: Commands) => void;
}
