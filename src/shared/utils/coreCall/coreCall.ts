import { RunService, StarterGui } from "@rbxts/services";

const MAX_RETRIES = 8;

export function coreCall(method: keyof StarterGui, ...args: unknown[]) {
	const result = [];
	for (let i = 0; i < MAX_RETRIES; i++) {
		const pcallResult = pcall(() => {
			(StarterGui[method] as (this: StarterGui, ...args: unknown[]) => void)(...args);
		});
		result[0] = pcallResult[0];
		result[1] = pcallResult[1];
		if (result[0] === true) break;
		RunService.Stepped.Wait();
	}
	return result;
}
