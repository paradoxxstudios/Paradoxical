import { Health } from "shared/ecs/components/types";
import { HealthState } from "./health";

export interface PlayerData {
	readonly health: Health;
}

export type State = HealthState;
