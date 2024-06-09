export type ChickynoidCommand = {
	deltaTime: number;
	f?: number;
	fa?: Vector3;
	l?: number;
	serverTime: number;
	tick?: number;

	x: number;
	y: number;
	z: number;

	flying?: number;

	reset: number;

	running: number;
};
