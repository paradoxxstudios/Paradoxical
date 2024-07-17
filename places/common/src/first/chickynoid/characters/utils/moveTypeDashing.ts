import { ChickyEnumAnimationChannels } from "../../package/shared/enums";
import { MathUtils as MathUtilsModule } from "../../package/shared/simulation/mathUtils";
import { MoveType } from "./moveType";

const MathUtils = require(
    script.Parent?.Parent?.Parent?.FindFirstChild("package")
        ?.FindFirstChild("shared")
        ?.FindFirstChild("simulation")
        ?.FindFirstChild("mathUtils") as ModuleScript,
) as typeof MathUtilsModule;

const module: MoveType = {
    ModifySimulation(this, simulation) {
        simulation.RegisterMoveState("Dashing", this.ActiveThink, this.AlwaysThink, undefined, this.EndState);
        simulation.state.dash = 0;
        simulation.state.dashDuration = 0.65;
        simulation.state.dashName = "FrontDash";
    },

    AlwaysThink: (simulation, command) => {
        if (simulation.GetMoveState().name !== "Walking") return;

        let onGround = undefined;
        onGround = simulation.DoGroundCheck(simulation.state.pos);
        if (onGround === undefined) return;

        if (simulation.state.dash > 0) {
            simulation.state.dash -= command.deltaTime;
            if (simulation.state.dash < 0) simulation.state.dash = 0;
        }

        if (command.dash === 1 && simulation.state.dash <= 0 && (command.x !== 0 || command.z !== 0)) {
            simulation.SetMoveState("Dashing");
        }
    },

    ActiveThink: (simulation, command) => {
        if (simulation.state.dashDuration > 0) {
            // Check ground
            let onGround = undefined;
            onGround = simulation.DoGroundCheck(simulation.state.pos);

            let flatVel = MathUtils.FlatVec(simulation.state.vel);
            let wishDir = simulation.state.lookDirection.Unit;

            // Do angles
            if (command.shiftLock === 1) {
                const vec = command.fa.sub(simulation.state.pos);
                simulation.state.targetAngle = MathUtils.PlayerVecToAngle(vec);
                simulation.state.angle = MathUtils.LerpAngle(
                    simulation.state.angle,
                    simulation.state.targetAngle,
                    simulation.constants.turnSpeedFrac * command.deltaTime,
                );

                if (command.x === 0 && command.z === 0) wishDir = vec.Unit;
                
                if (simulation.state.dashDuration === 0.65) {
                    const moveDir = simulation.state.lookDirection.Dot(vec);
                    if (moveDir > 1.7 && moveDir < 1.75) {
                        simulation.state.dashName = "RightDash";
                    } else if (moveDir < -1.7 && moveDir > -1.75) {
                        simulation.state.dashName = "LeftDash";
                    } else if (moveDir >= 1.75) {
                        simulation.state.dashName = "FrontDash";
                    } else if (moveDir <= -1.75) {
                        simulation.state.dashName = "BackDash";
                    }
                }  
                
            } else {
                if (simulation.state.lookDirection !== undefined) {
                    simulation.state.targetAngle = MathUtils.PlayerVecToAngle(simulation.state.lookDirection);
                    simulation.state.angle = MathUtils.LerpAngle(
                        simulation.state.angle,
                        simulation.state.targetAngle,
                        simulation.constants.turnSpeedFrac * command.deltaTime,
                    );
                }
            }

            flatVel = MathUtils.GroundAccelerate(
                wishDir,
                simulation.constants.maxSpeed * 5 * (simulation.state.dashDuration + 0.1),
                20,
                flatVel,
                command.deltaTime,
            );

            // Turn out flatvel back into our vel
            simulation.state.vel = new Vector3(flatVel.X, simulation.state.vel.Y, flatVel.Z);

            if (onGround === undefined) {
                 // Gravity
                 simulation.state.vel = simulation.state.vel.add(
                    new Vector3(0, simulation.constants.gravity * command.deltaTime, 0),
                );
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

            // Choose which one to use, either the original move or the stepup
            if (stepUpResult !== undefined) {
                simulation.state.stepUp += stepUpResult.stepUp;
                simulation.state.pos = stepUpResult.pos;
                simulation.state.vel = stepUpResult.vel;
            } else {
                simulation.state.pos = walkNewPos;
                simulation.state.vel = walkNewVel;
            }

            simulation.characterData.PlayAnimation(simulation.state.dashName, ChickyEnumAnimationChannels.Channel0, false);
            simulation.state.dashDuration -= command.deltaTime;
        } else {
            simulation.SetMoveState("Walking");
        }
    },

    EndState: (simulation, _) => {
        simulation.state.dashName = "FrontDash";
        simulation.state.dashDuration = 0.65;
        simulation.state.dash = 2;
    },
}

export = module;