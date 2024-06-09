import Simulation from "first/chickynoid/package/shared/simulation/simulation";
import type { MoveType } from "./moveType";
import { Commands } from "first/chickynoid/package/shared/vendor/crunchTable";

function ModifySimulation(this: MoveType, simulation: Simulation) {
	simulation.RegisterMoveState("Running", this.ActiveThink, this.AlwaysThink);
}

function ActiveThink(simulation: Simulation, command: Commands) {}

function AlwaysThink(simulation: Simulation, command: Commands) {
	if (command.running === 1) {
		simulation.constants.brakeFriction = 0.2;
		simulation.constants.accel = 3;
		simulation.constants.maxSpeed = 24;
		simulation.constants.airSpeed = 24;
	} else {
		simulation.constants.brakeFriction = 0.07;
		simulation.constants.accel = 50;
		simulation.constants.maxSpeed = 16;
		simulation.constants.airSpeed = 16;
	}
}

export = {
	ModifySimulation: ModifySimulation,
	ActiveThink: ActiveThink,
	AlwaysThink: AlwaysThink,
};
