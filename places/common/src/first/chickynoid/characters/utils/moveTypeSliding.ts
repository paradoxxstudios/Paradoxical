import { ChickyEnumAnimationChannels } from "../../package/shared/enums";
import MathUtils from "../../package/shared/simulation/mathUtils";
import { MoveType } from "./moveType";

const module: MoveType = {
    ModifySimulation(this, simulation) {
        simulation.RegisterMoveState("Sliding", this.ActiveThink, this.AlwaysThink, undefined, this.EndState);
        simulation.state.slide = 0;
        simulation.state.slideDuration = 1;
        simulation.state.timeSliding = 0;
    },

    AlwaysThink: (simulation, command) => {
        if (simulation.GetMoveState().name !== "Walking") return;

        let onGround = undefined;
		onGround = simulation.DoGroundCheck(simulation.state.pos);
        if (onGround === undefined) return;
        
        if (simulation.state.slide > 0) {
            simulation.state.slide -= command.deltaTime;
            if (simulation.state.slide < 0) simulation.state.slide = 0;
        }

        if (command.y < 0 && simulation.state.running && simulation.state.slide <= 0 && !simulation.state.crouching) {
            if (command.z !== 0 || command.x !== 0) {
                simulation.state.pushDir = new Vector2(command.x, command.z);
                simulation.state.previousPos = simulation.state.pos;
                simulation.state.deltaPos = simulation.state.pos.sub(simulation.state.previousPos);
                simulation.SetMoveState("Sliding");
            }
        }
    },

    ActiveThink: (simulation, command) => {
        if (simulation.state.slideDuration > 0) {
            // Check ground
            let onGround = undefined;
            onGround = simulation.DoGroundCheck(simulation.state.pos);

            // Direction
            let wishDir = new Vector3(simulation.state.pushDir.X, 0, simulation.state.pushDir.Y).Unit;

            // Create flat velocity to operate our input command on
            // In theory this should be relative to the ground plane instead...
            let flatVel = MathUtils.FlatVec(simulation.state.vel);

            let multiplier = 1 + simulation.state.slideDuration;
            if (simulation.state.timeSliding > 0.6) {
                multiplier = simulation.state.slideDuration * 0.65;
            }

            if (simulation.state.deltaPos.Y === 0) {
                multiplier *= 0.6;
            }
           
            if (onGround !== undefined) {
                // Moving along the ground under player input
                flatVel = MathUtils.GroundAccelerate(
                    wishDir,
                    simulation.constants.maxSpeed * 2 * multiplier,
                    simulation.constants.accel,
                    flatVel,
                    command.deltaTime,
                );
            }

            // Turn out flatvel back into our vel
            simulation.state.vel = new Vector3(flatVel.X, simulation.state.vel.Y, flatVel.Z);

            if (simulation.state.vel.Abs().X <= 5 && simulation.state.vel.Abs().Z <= 5) {
                simulation.SetMoveState("Walking");
                return;
            } 

            if (onGround !== undefined && command.y > 0 && !simulation.state.jumped) {
                simulation.state.vel = new Vector3(
                    simulation.state.vel.X,
                    simulation.constants.jumpPunch * 1.25,
                    simulation.state.vel.Z,
                );
                simulation.state.jumped = true;
                simulation.characterData.PlayAnimation("Jump", ChickyEnumAnimationChannels.Channel0, true, 0.2);
            }

            if (onGround === undefined) {
                simulation.state.inAir += command.deltaTime;
                // Capped just to keep the state var reasonable
                if (simulation.state.inAir > 10) simulation.state.inAir = 10;

                 // Gravity
                simulation.state.vel = simulation.state.vel.add(
                    new Vector3(0, simulation.constants.gravity * command.deltaTime, 0),
                );

                // Switch to falling if we have been off the ground for a bit
                if (simulation.state.vel.Y < -30 && simulation.state.inAir > 0.2) {
                    simulation.characterData.PlayAnimation("Fall", ChickyEnumAnimationChannels.Channel0, false);
                }

                simulation.state.slideDuration -= command.deltaTime * 1.5;
            } else {
                if (simulation.state.jumped && simulation.state.inAir > 0.2) {
                    simulation.SetMoveState("Walking");
                    return;
                }
            }           

            // Sweep the player through the world, and once flat along the ground, and once "step up'd"
            let stepUpResult = undefined;
            const result = simulation.ProjectVelocity(simulation.state.pos, simulation.state.vel, command.deltaTime);
            const walkNewPos = result[0];
            const walkNewVel = result[1];
            const hitSomething = result[2];

            // Did we attempt a stepup?
            if (onGround !== undefined && hitSomething) {
                stepUpResult = simulation.DoStepUp(simulation.state.pos, simulation.state.vel, command.deltaTime);
            }

            simulation.state.previousPos = simulation.state.pos;

            // Choose which one to use, either the original move or the stepup
            if (stepUpResult !== undefined) {
                simulation.state.stepUp += stepUpResult.stepUp;
                simulation.state.pos = stepUpResult.pos;
                simulation.state.vel = stepUpResult.vel;
            } else {
                simulation.state.pos = walkNewPos;
                simulation.state.vel = walkNewVel;
            }

            // Do angles
            simulation.state.vecAngle = wishDir;

            simulation.state.deltaPos = simulation.state.pos.sub(simulation.state.previousPos);
            simulation.state.slideDuration -= simulation.state.deltaPos.Y * 0.1 + command.deltaTime;

            if (!simulation.state.jumped) {
                simulation.characterData.PlayAnimation("Slide", ChickyEnumAnimationChannels.Channel0, false);
            }      

            simulation.state.timeSliding += command.deltaTime;
        } else {
            simulation.SetMoveState("Walking");
        }
    },

    EndState: (simulation, _) => {
        simulation.state.running = true;
        simulation.state.runToggle = true;
        simulation.state.slideDuration = 1;
        simulation.state.slide = 1.5;
        simulation.state.timeSliding = 0;
        simulation.state.jumped = false;
        simulation.state.inAir = 0;
    }
}

export = module;
