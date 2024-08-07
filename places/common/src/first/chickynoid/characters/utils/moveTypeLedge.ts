import GizmoModule from "../../../../shared/packages/gizmo";
import { ChickyEnumAnimationChannels } from "../../package/shared/enums";
import { MoveType } from "./moveType";

const Workspace = game.GetService("Workspace");
const ReplicatedStorage = game.GetService("ReplicatedStorage");

const raycastParams = new RaycastParams();
raycastParams.FilterType = Enum.RaycastFilterType.Include;
raycastParams.FilterDescendantsInstances = [game.Workspace.FindFirstChild("gameArea") as Instance];

const Gizmo = require(
    ReplicatedStorage.FindFirstChild("common")
    ?.FindFirstChild("packages")
    ?.FindFirstChild("gizmo") as ModuleScript
) as typeof GizmoModule;

const module: MoveType = {
    ModifySimulation(this, simulation) {
        simulation.RegisterMoveState("Ledge", this.ActiveThink, this.AlwaysThink);
    },

    AlwaysThink: (simulation, command) => {
        const onGround = simulation.DoGroundCheck(simulation.state.pos);
        if (onGround !== undefined) return;
        //if (simulation.GetMoveState().name === "Ledge") return;

        const pos = simulation.state.pos;
        const dir = simulation.state.vecAngle;
        Gizmo.drawRay(pos.add(new Vector3(0, 2, 0)), dir.mul(2.5));
        Gizmo.drawRay(pos.add(new Vector3(0,3.5,0)), dir.mul(3.5));
        const bottomResult = Workspace.Raycast(pos.add(new Vector3(0,2,0)), dir.mul(2.5), raycastParams);
        const topResult = Workspace.Raycast(pos.add(new Vector3(0,3.5,0)), dir.mul(3.5), raycastParams);

        if (bottomResult !== undefined && topResult === undefined) {
            if (simulation.state.doubleJumped) {
                const newPos = bottomResult.Position.add(bottomResult.Normal);
                simulation.state.pos = new Vector3(newPos.X, pos.Y, newPos.Z);

                simulation.state.vecAngle = bottomResult.Normal.mul(-1);
                simulation.SetMoveState("Ledge");
            }
        }
    },

    ActiveThink: (simulation, command) => {
        simulation.characterData.PlayAnimation("LedgeHold", ChickyEnumAnimationChannels.Channel0, false);
    },
}

export = module;
