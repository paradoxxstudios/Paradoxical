import Signal from "@rbxts/signal";

export interface SweepResult {
	startPos: Vector3;
	endPos: Vector3;
	fraction: number;
	startSolid: boolean;
	allSolid: boolean;
	planeNum: number;
	planeD: number;
	normal: Vector3;
	checks: number;
}

export namespace CollisionModule {
	export let loadProgress: number;
	export const OnLoadProgressChanged: Signal<(progress: number) => void>;

	export function ProcessCollisionOnInstance(this: typeof CollisionModule, instance: Instance): void;
	export function ClearCache(this: typeof CollisionModule): void;
}
