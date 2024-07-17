import ClientChickynoid from "./clientChickynoid";

export interface ClientMod {
	GetPriority?(): number;
	Step(deltaTime: number): void;
	Setup(): void;
	GenerateCommand(command: unknown, serverTime: number, deltaTime: number): unknown;

	resetRequested?: boolean;
	client: typeof ClientChickynoid;
	shiftlock?: 0 | 1;
}
