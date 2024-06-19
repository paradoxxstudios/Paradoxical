import ClientChickynoid from "../package/client/clientChickynoid";
import { ClientMod } from "../package/client/clientMod";
import { Commands } from "../package/shared/vendor/crunchTable";

const MAX_RETRIES = 8;
function coreCall(method: keyof StarterGui, ...args: unknown[]) {
	const result = [];
	for (let i = 0; i < MAX_RETRIES; i++) {
		const pcallResult = pcall(() => {
			(game.GetService("StarterGui")[method] as (this: StarterGui, ...args: unknown[]) => void)(...args);
		});
		result[0] = pcallResult[0];
		result[1] = pcallResult[1];
		if (result[0] === true) break;
		game.GetService("RunService").Stepped.Wait();
	}
	return result;
}

const UserInputService = game.GetService("UserInputService");
let ControlModule: undefined | { [index: string]: unknown } = undefined;

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

function Setup(this: ClientMod, _client: typeof ClientChickynoid) {
	this.client = _client;

	UserInputService.GetPropertyChangedSignal("MouseBehavior").Connect(() => {
		if (UserInputService.MouseBehavior === Enum.MouseBehavior.LockCenter) {
			this.shiftlock = 1;
		}
		if (UserInputService.MouseBehavior === Enum.MouseBehavior.Default) {
			this.shiftlock = 0;
		}
	});

	const resetBindable = new Instance("BindableEvent");
	resetBindable.Event.Connect(() => {
		this.resetRequested = true;
	});
	coreCall("SetCore", ...["ResetButtonCallback", resetBindable]);
}

function Step(_: ClientMod, _client: typeof ClientChickynoid, _dt: number) {}

function GenerateCommand(this: ClientMod, command: Commands, _serverTime: number, _dt: number) {
	command.x = 0;
	command.y = 0;
	command.z = 0;

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
		const run = UserInputService.IsKeyDown(Enum.KeyCode.LeftShift);

		if (crouch) {
			command.y = -1;
		} else if (jump) {
			command.y = 1;
		} 
		
		if (run) {
			command.running = 1;
		}
	}

	if (this.resetRequested) {
		this.resetRequested = false;
		command.reset = 1;
	}

	const rawMoveVector = CalculateRawMoveVector(new Vector3(command.x, 0, command.z));
	command.x = rawMoveVector.X;
	command.z = rawMoveVector.Z;

	return command;
}

function CalculateRawMoveVector(cameraRelativeMoveVector: Vector3) {
	const camera = game.Workspace.CurrentCamera;
	const yaw = camera?.CFrame.ToEulerAnglesYXZ()[1] as number;
	return CFrame.fromEulerAnglesYXZ(0, yaw, 0).mul(
		new Vector3(cameraRelativeMoveVector.X, 0, cameraRelativeMoveVector.Z),
	);
}

export = {
	Step: Step,
	Setup: Setup,
	GenerateCommand: GenerateCommand,
};
