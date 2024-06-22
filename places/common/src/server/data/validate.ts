import { SaveablePlayerData } from "../../shared/store/shared/slices/players";
import { t } from "../../shared/packages/t/t";

export const validate: t.check<SaveablePlayerData> = t.strictInterface({
	health: t.strictInterface({
		current: t.number,
		max: t.number,
		regenAmount: t.number,
		regenRate: t.number,
		regenCD: t.number,
	}),
});
