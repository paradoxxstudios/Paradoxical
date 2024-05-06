/* eslint-disable roblox-ts/lua-truthiness */
import ClientChickynoid from "@rbxts/chickynoid/types/Client/ClientChickynoid";
import { ChickynoidCommand } from "@rbxts/chickynoid/types/Shared/Command";

const UserInputService = game.GetService("UserInputService");
let ControlModule: undefined | { [index: string]: unknown } = undefined;
let client = undefined;

function GetControlModule() {
	if (ControlModule === undefined) {
		const localPlayer = game.GetService("Players").LocalPlayer;
		const scripts = localPlayer.FindFirstChild("PlayerScripts");
		if (scripts === undefined) return undefined;

		const playerModule = scripts.FindFirstChild("PlayerModule");
		if (playerModule === undefined) return undefined;

		const PlayerModule = require(playerModule as ModuleScript);
		ControlModule = (PlayerModule as { [index: string]: unknown }).controls as { [index: string]: unknown };
	}

	return ControlModule;
}

function Setup(_: typeof generateCommand, _client: typeof ClientChickynoid) {
	client = _client;
}

function Step(_: typeof generateCommand, _client: typeof ClientChickynoid, _dt: number) {}

function GenerateCommand(this: typeof generateCommand, command: ChickynoidCommand, serverTime: number, dt: number) {
	if (command === undefined) {
		command = {
			x: 0,
			y: 0,
			z: 0,
			deltaTime: dt,
			serverTime: serverTime,
		};
	}

	command.x = 0;
	command.y = 0;
	command.z = 0;
	command.deltaTime = 0;
	command.serverTime = 0;

	GetControlModule();
	if (ControlModule !== undefined) {
		let moveVector: Vector3 = (
			ControlModule as { GetMoveVector: (self: typeof ControlModule) => Vector3 }
		).GetMoveVector(ControlModule);
		if (moveVector.Magnitude > 0) {
			moveVector = moveVector.Unit;
			command.x = moveVector.X;
			command.y = moveVector.Y;
			command.z = moveVector.Z;
		}
	}

	if (!UserInputService.GetFocusedTextBox()) {
		const jump = UserInputService.IsKeyDown(Enum.KeyCode.Space);
		const crouch = UserInputService.IsKeyDown(Enum.KeyCode.C);
		command.y = 0;
		if (jump) {
			command.y = 1;
		} else if (crouch) {
			command.y = -1;
		}
	}

	if (this.GetIsJumping(this)) command.y = 1;

	const rawMoveVector = this.CalculateRawMoveVector(this, new Vector3(command.x, 0, command.z));
	command.x = rawMoveVector.X;
	command.z = rawMoveVector.Z;

	return command;
}

function GetIsJumping(_: typeof generateCommand) {
	if (ControlModule === undefined) return false;
	if (ControlModule.activeController === undefined) return false;

	return (
		(ControlModule.activeController as { GetIsJumping: (self: typeof ControlModule) => boolean }).GetIsJumping(
			ControlModule,
		) ||
		(ControlModule.touchJumpController &&
			(
				ControlModule.touchJumpController as { GetIsJumping: (self: typeof ControlModule) => boolean }
			).GetIsJumping(ControlModule))
	);
}

function CalculateRawMoveVector(_: typeof generateCommand, cameraRelativeMoveVector: Vector3) {
	const camera = game.Workspace.CurrentCamera;
	const yaw = camera?.CFrame.ToEulerAnglesYXZ()[1] as number;
	return CFrame.fromEulerAnglesYXZ(0, yaw, 0).mul(
		new Vector3(cameraRelativeMoveVector.X, 0, cameraRelativeMoveVector.Z),
	);
}

const generateCommand = {
	client: client,
	Step: Step,
	Setup: Setup,
	GenerateCommand: GenerateCommand,
	GetIsJumping: GetIsJumping,
	CalculateRawMoveVector: CalculateRawMoveVector,
};

export = generateCommand;
