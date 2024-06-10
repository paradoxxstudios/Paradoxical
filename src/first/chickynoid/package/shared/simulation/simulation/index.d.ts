import { Commands } from "../../vendor/crunchTable";
import CharacterData from "../characterData";
import { SweepResult } from "../collisionModule";
import { SimulationConstants } from "./simulation-constants";
import { SimulationState } from "./simulation-state";

type ThinkFunc = (simulation: Simulation, command: Commands) => void;

interface Simulation {
	state: SimulationState;
	constants: SimulationConstants;
	userId: number;
	lastGround: unknown | undefined;
	characterData: CharacterData;

	RegisterMoveState(
		name: string,
		/** Runs while active */
		activeThink: ThinkFunc,
		/** Runs every frame. */
		alwaysThink?: ThinkFunc,
		startState?: ThinkFunc,
		/** Cleanup */
		lastThink?: ThinkFunc,
		alwaysThinkLate?: ThinkFunc,
		executionOrder?: number,
	): void;

	GetMoveState(): {
		name: string;
	};
	SetMoveState(moveState: string): void;

	SetPosition(position: Vector3, teleport: boolean): void;
	SetAngle(angle: number, teleport: boolean): void;

	ProjectVelocity(
		startPos: Vector3,
		startVel: Vector3,
		deltaTime: number,
	): LuaTuple<[movePos: Vector3, moveVel: Vector3, hitSomething: boolean]>;

	DoGroundCheck(pos: Vector3): SweepResult | undefined;
	CheckGroundSlopes(startPos: Vector3): boolean;

	CrashLand(vel: Vector3, ground: SweepResult): Vector3;

	DoStepUp(pos: Vector3, vel: Vector3, deltaTime: number): undefined | { stepUp: number; pos: Vector3; vel: Vector3 };
	DoStepDown(pos: Vector3): undefined | { pos: Vector3; stepDown: number };
}

interface SimulationConstructor {
	/**
	 * Constructed internally. Do not use directly.
	 * @private
	 */
	new (): Simulation;
}

declare const Simulation: SimulationConstructor;
export = Simulation;
