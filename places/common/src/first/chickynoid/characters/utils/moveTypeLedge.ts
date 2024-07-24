import { ChickyEnumAnimationChannels } from "../../package/shared/enums";
import { MoveType } from "./moveType";

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
