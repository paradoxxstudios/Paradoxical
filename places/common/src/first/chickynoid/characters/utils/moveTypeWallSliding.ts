import GizmoModule from "../../../../shared/packages/gizmo";
import { ChickyEnumAnimationChannels } from "../../package/shared/enums";
import MathUtils from "../../package/shared/simulation/mathUtils";
import { MoveType } from "./moveType";

const Workspace = game.GetService("Workspace");
const ReplicatedStorage = game.GetService("ReplicatedStorage");

const Gizmo = require(
    ReplicatedStorage.FindFirstChild("common")
    ?.FindFirstChild("packages")
    ?.FindFirstChild("gizmo") as ModuleScript
) as typeof GizmoModule;

const raycastParams = new RaycastParams();
raycastParams.FilterType = Enum.RaycastFilterType.Include;
raycastParams.FilterDescendantsInstances = [game.Workspace.FindFirstChild("gameArea") as Instance];

const module: MoveType = {
    ModifySimulation(this, simulation) {
        simulation.RegisterMoveState("WallSliding", this.ActiveThink, this.AlwaysThink, this.StartState, this.EndState);
        simulation.state.timeWallSliding = 0;
        simulation.state.wallSide = 1;
        simulation.state.sameWallCD = 0;
    },

    AlwaysThink: (simulation, command) => {
        const onGround = simulation.DoGroundCheck(simulation.state.pos);
        if (onGround !== undefined) {
            simulation.state.sameWallCD = 0;
            return;
        }

        if (simulation.state.rightVector) {
            Gizmo.drawRay(simulation.state.pos, simulation.state.rightVector.mul(3));
            Gizmo.drawRay(simulation.state.pos, simulation.state.rightVector.mul(-3));

            const rightResult = Workspace.Raycast(simulation.state.pos, simulation.state.rightVector.mul(3), raycastParams);
            const leftResult = Workspace.Raycast(simulation.state.pos, simulation.state.rightVector.mul(-3), raycastParams);

            if (rightResult) {
                simulation.state.wallNormal = rightResult.Normal.Unit;
                simulation.state.wallSide = 1;
            } else if (leftResult) {
                simulation.state.wallNormal = leftResult.Normal.Unit;
                simulation.state.wallSide = -1;
            } else {
                simulation.state.wallNormal = undefined;
                simulation.state.sameWallCD = 0;
                return;
            }

            simulation.state.sameWallCD = math.max(0, simulation.state.sameWallCD - command.deltaTime);
            if (simulation.state.doubleJumped && simulation.GetMoveState().name !== "WallSliding" && simulation.state.sameWallCD === 0) {
                if (simulation.state.moveDirection.Magnitude !== 0) simulation.SetMoveState("WallSliding");
            }
        }
    },

    StartState: (simulation) => {
        simulation.state.sameWallCD = 0.75;
        simulation.characterData.PlayAnimation("WallSlideStart", ChickyEnumAnimationChannels.Channel0, true, 0.3);
    },

    ActiveThink: (simulation, command) => {
        const onGround = simulation.DoGroundCheck(simulation.state.pos);
        if (onGround !== undefined || simulation.state.wallNormal === undefined) {
            simulation.SetMoveState("Walking");
            return;
        }

        let flatVel = MathUtils.FlatVec(simulation.state.vel);
        flatVel = MathUtils.Accelerate(
            simulation.state.vecAngle,
            simulation.constants.maxSpeed * 2 * math.exp(-0.01 * simulation.state.timeWallSliding),
            20,
            flatVel,
            command.deltaTime,
        );

        // Turn out flatvel back into our vel
        simulation.state.vel = new Vector3(flatVel.X, simulation.state.vel.Y, flatVel.Z);

        if (simulation.state.timeWallSliding >= 0.15 && command.y === 1) {
            let velX = simulation.state.vel.X;
            let velZ = simulation.state.vel.Z;
            if (simulation.state.moveDirection.X * simulation.state.wallSide < 0) {
                velX = velX * 0.75 + simulation.state.wallNormal.X * 50;
                velZ = velZ * 0.75 + simulation.state.wallNormal.Z * 50;
                simulation.state.sameWallCD = 0;
            }

            simulation.state.vel = new Vector3(velX, simulation.constants.jumpPunch, velZ);
            simulation.SetMoveState("Walking");
        }

        // Gravity
        simulation.state.vel = simulation.state.vel.add(
            new Vector3(0, simulation.constants.gravity * 0.1 * command.deltaTime, 0),
        );

        const result = simulation.ProjectVelocity(simulation.state.pos, simulation.state.vel, command.deltaTime);
        simulation.state.pos = result[0];
        simulation.state.vel = result[1];

        simulation.state.vecAngle = simulation.state.wallNormal.Cross(Vector3.yAxis).mul(simulation.state.wallSide);
        simulation.characterData.PlayAnimation("WallSlide", ChickyEnumAnimationChannels.Channel0, false);
        simulation.state.timeWallSliding += command.deltaTime;
    },

    EndState: (simulation) => {
        if (simulation.state.jumped) {
            simulation.characterData.PlayAnimation("Jump", ChickyEnumAnimationChannels.Channel0, true, 0.2);
        } else {
            simulation.characterData.PlayAnimation("WallSlideEnd", ChickyEnumAnimationChannels.Channel0, true, 0.5);
        }
        simulation.state.timeWallSliding = 0;
    },
}

export = module;