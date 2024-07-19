export interface SimulationState {
	pos: Vector3;
	previousPos: Vector3;
	deltaPos: Vector3;
	vel: Vector3;
	stepUp: number;
	inAir: number;

	moveDirection: Vector3;
	lastMoveDirection: Vector3;
	lookVector: Vector3;
	rightVector: Vector3;

	angle: number;
	targetAngle: number;
	doNotReconcileAngle: boolean;

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

	dash: number;
	dashDuration: number;
	dashName: string;

	crouching: boolean;
}
