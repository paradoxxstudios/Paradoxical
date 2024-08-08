export interface SimulationState {
	pos: Vector3;
	headPos: Vector3;
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
	vecAngle: Vector3;

	pushing: number;
	pushDir: Vector2;

	crouching: boolean;

	jumped: boolean;
	jump: number;
	wasJumping: boolean;
	jumpThrust: number;
	canJumpAgain: boolean;
	doubleJumped: boolean;
	
	running: boolean;
	runToggle: boolean;

	slide: number;
	slideDuration: number;
	timeSliding: number;

	dash: number;
	dashDuration: number;
	dashName: string;

	wallNormal?: Vector3;
	sameWallCD: number;
	lastWallInstance: Instance;
	wallInstance: Instance;
	timeWallSliding: number;
	wallSide: 1 | -1;

	ledgeHoldCD: number;
	ledgePos: Vector3;
}
