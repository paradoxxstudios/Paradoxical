import MathUtilsModule from "../../package/shared/simulation/mathUtils";
import { MoveType } from "./moveType";
import { ChickyEnumAnimationChannels } from "../../package/shared/enums";

const MathUtils = require(
    script.Parent?.Parent?.Parent?.FindFirstChild("package")
        ?.FindFirstChild("shared")
        ?.FindFirstChild("simulation")
        ?.FindFirstChild("mathUtils") as ModuleScript,
) as typeof MathUtilsModule;

const module: MoveType = {
	ModifySimulation(this, simulation) {
		simulation.RegisterMoveState("Walking", this.ActiveThink, this.AlwaysThink);
		simulation.SetMoveState("Walking");
		simulation.state.jumped = false;
		simulation.state.running = false;
		simulation.state.runToggle = false;
		simulation.state.crouching = false;
		simulation.state.vecAngle = Vector3.zero;
	},

	AlwaysThink: (simulation, command) => {
		simulation.state.moveDirection = command.moveDirection;

		if (command.x !== 0 || command.z !== 0) {
			simulation.state.lastMoveDirection = new Vector3(command.x, 0, command.z).Unit;
		}

		simulation.state.lookVector = command.cameraLookVector;
		simulation.state.rightVector = simulation.state.vecAngle.Cross(Vector3.yAxis);
		simulation.state.targetAngle = MathUtils.PlayerVecToAngle(simulation.state.vecAngle);
		simulation.state.angle = MathUtils.LerpAngle(
			simulation.state.angle,
			simulation.state.targetAngle,
			simulation.constants.turnSpeedFrac * command.deltaTime,
		);

		simulation.state.doubleJumped = command.y === 1 
					&& !simulation.state.wasJumping 
					&& simulation.state.jump !== 0.2
					&& simulation.DoGroundCheck(simulation.state.pos) === undefined;

		if (command.y === 1) {
			// Set the flag to indicate the space key was pressed
			simulation.state.wasJumping = true;
		} else {
			// Reset the flag when the space key is released
			simulation.state.wasJumping = false;
			simulation.state.canJumpAgain = true; // Allow jumping again when the key is released
		}
	
		// Check if jump cooldown is active
		if (simulation.state.jump > 0) {
			simulation.state.jump -= command.deltaTime;
			if (simulation.state.jump < 0) simulation.state.jump = 0;
		}
	
		// Reset the jumped flag when the space key is not held (command.y === 0)
		if (command.y === 0) {
			simulation.state.jumped = false;
		}
	},

	ActiveThink: (simulation, command) => {
		simulation.constants.maxSpeed = 16;
		simulation.constants.airSpeed = 16;
		simulation.constants.brakeFriction = 0.05;
		simulation.constants.accel = 50;

		if (command.running === 1 && !simulation.state.runToggle && !simulation.state.crouching) {
			simulation.state.runToggle = true;
			simulation.state.running = !simulation.state.running;
			simulation.state.crouching = false;
		} else if (command.running === 0) {
			simulation.state.runToggle = false;
			simulation.state.crouching = false;
		}

		if (simulation.state.running) {
			simulation.constants.maxSpeed = 24;
			simulation.constants.airSpeed = 24;
			simulation.constants.brakeFriction = 0.1;
			simulation.constants.accel = 4;
		} 

		// Check ground
		let onGround = undefined;
		onGround = simulation.DoGroundCheck(simulation.state.pos);

		if (command.y === -1 && onGround !== undefined) {
			simulation.state.crouching = true;
			simulation.constants.maxSpeed = 5;
		}

		// If the player is on too steep of a slope, then its not on ground
		if (onGround !== undefined && onGround.normal.Y < simulation.constants.maxGroundSlope) {
			// See if we can move downwards?
			if (simulation.state.vel.Y < 0.1) {
				const stuck = simulation.CheckGroundSlopes(simulation.state.pos);
				if (!stuck) {
					// We moved, which means that the player is on a slope and can freefall
					onGround = undefined;
				} else {
					// We didn't move, which means the ground we are on is sloped, but we can not fall any further
					// Treat it like flat ground
					onGround.normal = Vector3.yAxis;
				}
			} else {
				onGround = undefined;
			}
		}

		// Mark if we were on ground at the start on the frame
		const startedOnGround = onGround;
		// Simplify whatever we are at the start of the grame goes
		simulation.lastGround = onGround;

		// Did the player have a movement request?
		let wishDir = undefined;
		if (command.x !== 0 || command.z !== 0) {
			wishDir = new Vector3(command.x, 0, command.z).Unit;
			simulation.state.pushDir = new Vector2(command.x, command.z);
		} else {
			simulation.state.pushDir = Vector2.zero;
		}

		// Create flat velocity to operate our input command on
		// In theory this should be relative to the ground plane instead...
		let flatVel = MathUtils.FlatVec(simulation.state.vel);

		// Does the player have an input?
		if (wishDir !== undefined) {
			if (onGround) {
				// Moving along the ground under player input
				flatVel = MathUtils.GroundAccelerate(
					wishDir,
					simulation.constants.maxSpeed,
					simulation.constants.accel,
					flatVel,
					command.deltaTime,
				);

				// Good time to trigger our walk anim
				if (simulation.state.pushing > 0) {
					simulation.characterData.PlayAnimation("Push", ChickyEnumAnimationChannels.Channel0, false);
				} else {
					if (simulation.state.crouching) {
						simulation.characterData.PlayAnimation("Crouch", ChickyEnumAnimationChannels.Channel0, false);
					} else if (simulation.state.running) {
						simulation.characterData.PlayAnimation("Run", ChickyEnumAnimationChannels.Channel0, false);
					} else {
						simulation.characterData.PlayAnimation("Walk", ChickyEnumAnimationChannels.Channel0, false);
					}
				}
			} else {
				// Moving through the air under player control
				flatVel = MathUtils.Accelerate(
					wishDir,
					simulation.constants.airSpeed,
					simulation.constants.airAccel,
					flatVel,
					command.deltaTime,
				);
			}
		} else {
			if (onGround !== undefined) {
				// Just standing around
				flatVel = MathUtils.VelocityFriction(flatVel, simulation.constants.brakeFriction, command.deltaTime);
				// Enter idle
				if (command.y === -1) {
					simulation.characterData.PlayAnimation("CrouchIdle", ChickyEnumAnimationChannels.Channel0, false);
				} else {
					simulation.characterData.PlayAnimation("Idle", ChickyEnumAnimationChannels.Channel0, false);
				}
			} else {
				// Moving through the air with no input
				flatVel = MathUtils.VelocityFriction(flatVel, simulation.constants.brakeFriction, command.deltaTime);
			}
		}

		// Turn out flatvel back into our vel
		simulation.state.vel = new Vector3(flatVel.X, simulation.state.vel.Y, flatVel.Z);

		if (onGround !== undefined) {
			// Jump!
			if (command.y > 0 && simulation.state.jump <= 0 && simulation.state.canJumpAgain) {
				simulation.state.vel = new Vector3(
					simulation.state.vel.X,
					simulation.constants.jumpPunch,
					simulation.state.vel.Z,
				);
				simulation.state.canJumpAgain = false;
				simulation.state.jump = 0.2;
				simulation.state.jumped = true;
				simulation.state.jumpThrust = simulation.constants.jumpThrustPower;
				simulation.characterData.PlayAnimation("Jump", ChickyEnumAnimationChannels.Channel0, true, 0.2);
			}
		}

		// In air?
		if (onGround === undefined) {
			simulation.state.inAir += command.deltaTime;
			// Capped just to keep the state var reasonable
			if (simulation.state.inAir > 10) simulation.state.inAir = 10;

			// Jump thrust
			if (command.y > 0) {
				if (simulation.state.jumpThrust > 0) {
					simulation.state.vel = simulation.state.vel.add(
						new Vector3(0, simulation.state.jumpThrust * command.deltaTime, 0),
					);
					simulation.state.jumpThrust = MathUtils.Friction(
						simulation.state.jumpThrust,
						simulation.constants.jumpThrustDecay,
						command.deltaTime,
					);
				}
				if (simulation.state.jumpThrust < 0.001) simulation.state.jumpThrust = 0;
			} else {
				simulation.state.jumpThrust = 0;
			}

			// Gravity
			simulation.state.vel = simulation.state.vel.add(
				new Vector3(0, simulation.constants.gravity * command.deltaTime, 0),
			);

			// Switch to falling if we have been off the ground for a bit
			if (simulation.state.vel.Y < -30 && simulation.state.inAir > 0.2) {
				simulation.characterData.PlayAnimation("Fall", ChickyEnumAnimationChannels.Channel0, false);
			}
		} else {
			simulation.state.inAir = 0;
		}

		// Sweep the player through the world, and once flat along the ground, and once "step up'd"
		let stepUpResult = undefined;
		const result = simulation.ProjectVelocity(simulation.state.pos, simulation.state.vel, command.deltaTime);
		const walkNewPos = result[0];
		let walkNewVel = result[1];
		const hitSomething = result[2];

		// Did we crashland
		if (onGround === undefined && hitSomething) {
			// Land after jump
			const groundCheck = simulation.DoGroundCheck(walkNewPos);
			// Crashland
			if (groundCheck !== undefined) walkNewVel = simulation.CrashLand(walkNewVel, groundCheck);
		}

		// Did we attempt a stepup?                          (not jumping)
		if (onGround !== undefined && hitSomething && simulation.state.jump === 0) {
			stepUpResult = simulation.DoStepUp(simulation.state.pos, simulation.state.vel, command.deltaTime);
		}

		// Choose which one to use, either the original move or the stepup
		if (stepUpResult !== undefined) {
			simulation.state.stepUp += stepUpResult.stepUp;
			simulation.state.pos = stepUpResult.pos;
			simulation.state.vel = stepUpResult.vel;
		} else {
			simulation.state.pos = walkNewPos;
			simulation.state.vel = walkNewVel;
		}

		// Do stepdown
		if (startedOnGround !== undefined && simulation.state.jump === 0 && simulation.state.vel.Y <= 0) {
			const stepDownResult = simulation.DoStepDown(simulation.state.pos);
			if (stepDownResult !== undefined) {
				simulation.state.stepUp += stepDownResult.stepDown;
				simulation.state.pos = stepDownResult.pos;
			}
		}

		simulation.state.vecAngle = simulation.state.lookVector;
	},
};

export = module;
