import { ChickynoidClient } from "./chickynoidClient";

export interface ClientMod {
	GetPriority?(): number;
	Step(deltaTime: number): void;
	Setup(): void;
	GenerateCommand(command: unknown, serverTime: number, deltaTime: number): unknown;

	resetRequested?: boolean;
	client: typeof ChickynoidClient;
}
