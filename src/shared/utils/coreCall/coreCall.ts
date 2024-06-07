import { RunService, StarterGui } from "@rbxts/services";

const MAX_RETRIES = 8;

export function coreCall(method: keyof StarterGui, ...args: unknown[]) {
	const result = [];
	for (let i = 0; i < MAX_RETRIES; i++) {
		try {
			result[0] = (StarterGui[method] as (...args: unknown[]) => void)(...args);
		} catch {
			result[0] = false;
		}
		if (result[0] !== false) break;
		RunService.Stepped.Wait();
	}
	return result[0];
}
