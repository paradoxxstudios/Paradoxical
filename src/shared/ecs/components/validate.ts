import { t } from "@rbxts/t";

const Health = t.interface(
	new Map<string, t.check<number>>([
		["health", t.number],
		["maxHealth", t.number],
		["regenAmount", t.number],
		["regenRate", t.number],
		["regenCD", t.number],
	]),
);

// eslint-disable-next-line prettier/prettier
export const VALIDATE: Map<string, t.check<unknown>> = new Map<string, t.check<unknown>>([
    ["health", Health],
])