import { t } from "@rbxts/t";
import { SaveablePlayerData } from "shared/state/shared/slices/players";

export const validate: t.check<SaveablePlayerData> = t.strictInterface({
	health: t.strictInterface({
		current: t.number,
		max: t.number,
		regenAmount: t.number,
		regenRate: t.number,
		regenCD: t.number,
	}),
});
