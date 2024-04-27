import { Health, Transform } from "./types";

/**
 * The default value created when no data is provided to a {@link Transform}
 * component.
 */
export const transform: Transform = {
	cframe: CFrame.identity,
};

export const health: Health = {
	health: 100,
	maxHealth: 100,
	regenAmount: 2,
	regenRate: 1,
	regenCD: 5,
};
