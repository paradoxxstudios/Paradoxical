import { CharacterMod } from "../package/client/characterMod";
import Simulation from "../package/shared/simulation/simulation";
import { MoveType } from "./utils/moveType";

const utils = script.Parent?.FindFirstChild("utils") as Folder;
function requireMoveTypes(simulation: Simulation) {
	for (const module of utils.GetChildren()) {
		if (module.Name.sub(0, 8) !== "moveType") continue;
		const moveType = require(module as ModuleScript) as MoveType;
		moveType.ModifySimulation(simulation);
	}
}

function SetUp(this: CharacterMod, simulation: Simulation) {
	simulation.constants.maxSpeed = 16;
	simulation.constants.airSpeed = 16; // Units per second
	simulation.constants.accel = 50; // Units per second per second
	simulation.constants.airAccel = 4; // Uses a different function than ground accel!
	simulation.constants.jumpPunch = 50; // Raw velocity, just barely enough to climb on a 7 unit tall block
	simulation.constants.turnSpeedFrac = 7; // seems about right? Very fast.
	simulation.constants.runFriction = 0.01; // friction applied after max speed
	simulation.constants.brakeFriction = 0.05; // Lower is brake harder, dont use 0
	simulation.constants.maxGroundSlope = 0.55; // about 45o
	simulation.constants.jumpThrustPower = 0; // If you keep holding jump, how much extra vel per second is there?  (turn this off for no variable height jumps)
	simulation.constants.jumpThrustDecay = 0.4; // Smaller is faster
	simulation.constants.stepSize = 2;

	requireMoveTypes(simulation);
}

export = {
	Setup: SetUp,
};
