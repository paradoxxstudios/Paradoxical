export interface SimulationState {
	characterData: unknown;
	pos: Vector3;
	previousPos: Vector3;
	deltaPos: Vector3;
	vel: Vector3;
	stepUp: number;
	inAir: number;

	angle: number;
	targetAngle: number;

	pushing: number;
	pushDir: Vector2;

	jumped: boolean;
	jump: number;
	jumpThrust: number;
	
	running: boolean;
	runToggle: boolean;

	slide: number;
	slideDuration: number;
	timeSliding: number;

	crouching: boolean;
}
