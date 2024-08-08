import GizmoModule from "../../../../shared/packages/gizmo";
import { ChickyEnumAnimationChannels } from "../../package/shared/enums";
import MathUtilsModule from "../../package/shared/simulation/mathUtils";
import { MoveType } from "./moveType";

const Workspace = game.GetService("Workspace");
const ReplicatedStorage = game.GetService("ReplicatedStorage");

const MathUtils = require(
    script.Parent?.Parent?.Parent?.FindFirstChild("package")
        ?.FindFirstChild("shared")
        ?.FindFirstChild("simulation")
        ?.FindFirstChild("mathUtils") as ModuleScript,
) as typeof MathUtilsModule;

const Gizmo = require(
    ReplicatedStorage.FindFirstChild("common")
    ?.FindFirstChild("packages")
    ?.FindFirstChild("gizmo") as ModuleScript
) as typeof GizmoModule;

const raycastParams = new RaycastParams();
raycastParams.FilterType = Enum.RaycastFilterType.Include;
raycastParams.FilterDescendantsInstances = [game.Workspace.FindFirstChild("gameArea") as Instance];

function partCheck(ledge: CFrame, raycastPrams: RaycastParams): boolean {
    Gizmo.drawRay(ledge.Position.add(new Vector3(0, -1, 0)).add(ledge.LookVector), ledge.UpVector.mul(1.75));
	const ledgeCheck = Workspace.Raycast(
		ledge.Position.add(new Vector3(0, -1, 0)).add(ledge.LookVector),
		ledge.UpVector.mul(1.75),
		raycastPrams,
	);
	return ledgeCheck === undefined;
}

const module: MoveType = {
    ModifySimulation(this, simulation) {
        simulation.RegisterMoveState("Ledge", this.ActiveThink, this.AlwaysThink, undefined, this.EndState);
        simulation.state.ledgeHoldCD = 0;
    },

    AlwaysThink: (simulation, command) => {
        const onGround = simulation.DoGroundCheck(simulation.state.pos);
        if (onGround !== undefined) return;
        if (simulation.GetMoveState().name === "Ledge" || simulation.GetMoveState().name === "WallSliding") return;

        if (simulation.state.ledgeHoldCD > 0) {
            simulation.state.ledgeHoldCD -= command.deltaTime;
            if (simulation.state.ledgeHoldCD < 0) simulation.state.ledgeHoldCD = 0;
        }
        if (simulation.state.ledgeHoldCD > 0) return;
        if (!simulation.state.doubleJumped) return;

        Gizmo.drawRay(simulation.state.pos, simulation.state.vecAngle.mul(5));
        const result = Workspace.Raycast(simulation.state.pos, simulation.state.vecAngle.mul(5), raycastParams);
        if (result === undefined) return;

        const constPos = result.Instance.CFrame.PointToObjectSpace(result.Position);
        const constLedgePos = new Vector3(constPos.X, result.Instance.Size.Y / 2, constPos.Z);
        const ledgePos = result.Instance.CFrame.PointToWorldSpace(constLedgePos);
        const ledgeOffset = CFrame.lookAt(ledgePos, ledgePos.sub(result.Normal));

        const magnitude = ledgePos.sub(simulation.state.headPos).Magnitude;
		if (magnitude < 2 && partCheck(ledgeOffset, raycastParams)) {
            simulation.state.pos = ledgeOffset.Position.add(new Vector3(0,-2.2,0)).add(ledgeOffset.LookVector.mul(-1.1));
            simulation.state.vecAngle = result.Normal.mul(-1);
            simulation.SetMoveState("Ledge");
        }
    },

    ActiveThink: (simulation, command) => {
        //simulation.state.pos = simulation.state.ledgePos;
        simulation.state.vel = Vector3.zero;

        if (simulation.state.doubleJumped) {
            simulation.characterData.PlayAnimation("Jump", ChickyEnumAnimationChannels.Channel0, true, 0.2);
            simulation.state.vel = simulation.state.vel.add(Vector3.yAxis.mul(50));
            simulation.SetMoveState("Walking");
        }

        const result = simulation.ProjectVelocity(simulation.state.pos, simulation.state.vel, command.deltaTime);
        simulation.state.pos = result[0];
        simulation.state.vel = result[1];

        simulation.characterData.PlayAnimation("LedgeHold", ChickyEnumAnimationChannels.Channel0, false);
    },

    EndState: (simulation, _) => {
        simulation.state.ledgeHoldCD = 0.15;
    },
}

export = module;
