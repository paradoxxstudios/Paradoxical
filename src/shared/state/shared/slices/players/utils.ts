import { health } from "shared/ecs/components/defaults";
import { SaveablePlayerData } from "./types";

export const defaultPlayerData: SaveablePlayerData = {
	health: health,
};
