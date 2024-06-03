import { Health, LedgeInfo, Transform } from "./types";

/**
 * The default value created when no data is provided to a {@link Transform}
 * component.
 */
export const transform: Transform = {
	cframe: new CFrame(0, 5, 0),
};

export const health: Health = {
	current: 100,
	max: 100,
	regenAmount: 2,
	regenRate: 1,
	regenCD: 5,
};

export const ledgeInfo: LedgeInfo = {
	jumped: false,
	canVault: true,
	ledgeMoveAmount: 15,
};
