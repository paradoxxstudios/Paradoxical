import { RaycastVisualizer } from "../../../../shared/packages/raycastVisualizer";
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
        simulation.RegisterMoveState("WallRunning", this.ActiveThink, this.AlwaysThink, undefined, this.EndState);
    },

    AlwaysThink: (simulation, command) => {
        if (simulation.GetMoveState().name !== "Walking") return;

        const onGround = simulation.DoGroundCheck(simulation.state.pos);
        if (onGround !== undefined) return;
        
        // if (simulation.state.rightVector) {
        //     const testRay = new RaycastVisualizer();
        //     testRay.Raycast(simulation.state.pos, simulation.state.rightVector.mul(10));
        // }
    },

    ActiveThink: (simulation, command) => {
        
    },

    EndState: (simulation, _) => {
        
    },
}

export = module;