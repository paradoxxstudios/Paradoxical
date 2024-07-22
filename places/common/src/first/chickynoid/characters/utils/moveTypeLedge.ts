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
        simulation.RegisterMoveState("LedgeMove", this.ActiveThink, this.AlwaysThink);
        
    },

    AlwaysThink: (simulation, command) => {
        
    },

    ActiveThink: (simulation, command) => {
        
    },
}

export = module;
