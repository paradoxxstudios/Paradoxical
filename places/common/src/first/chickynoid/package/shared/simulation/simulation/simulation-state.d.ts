export interface SimulationState {
	pos: Vector3;
	vel: Vector3;
	pushDir: Vector2;
	jump: number;
	angle: number;
	targetAngle: number;
	stepUp: number;
	inAir: number;
	jumpThrust: number;
	pushing: number;
	characterData: unknown;
	jumped: boolean;
	
	running: boolean;
	runToggle: boolean;

	slide: number;
	slideDuration: number;

	crouching: boolean;
}
