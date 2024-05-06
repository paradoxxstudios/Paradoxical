import Simulation from "@rbxts/chickynoid/types/Simulation";

function Setup(this: typeof nicerHumanoid, simulation: Simulation) {
	simulation.constants.maxSpeed = 16; // Units per second
	simulation.constants.airSpeed = 16; // Units per second
	simulation.constants.accel = 10; // Units per second per second
	simulation.constants.airAccel = 10; // Uses a different function than ground accel!
	simulation.constants.jumpPunch = 35; // Raw velocity, just barely enough to climb on a 7 unit tall block
	simulation.constants.turnSpeedFrac = 10; // seems about right? Very fast.
	simulation.constants.runFriction = 0.01; // friction applied after max speed
	simulation.constants.brakeFriction = 0.03; // Lower is brake harder, dont use 0
	simulation.constants.maxGroundSlope = 0.55; // about 45o
	simulation.constants.jumpThrustPower = 300; // If you keep holding jump, how much extra vel per second is there?  (turn this off for no variable height jumps)
	simulation.constants.jumpThrustDecay = 0.25; // Smaller is faster
}

function GetCharacterModel(this: typeof nicerHumanoid, userId: number) {
	return undefined;
}

const nicerHumanoid = { Setup: Setup, GetCharacterModel: GetCharacterModel };

export = nicerHumanoid;
