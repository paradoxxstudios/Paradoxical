import { AnyEntity, Debugger, Loop, World } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";
import { Players, ReplicatedStorage, RunService, UserInputService } from "@rbxts/services";

import { Host } from "shared/hosts";
import { tags } from "./boundTags";
import { Model } from "./components";
import { RootProducer, state } from "../state";
import { start as startSystems, stop as stopSystems } from "./systems";
import { start as startTags, stop as stopTags } from "./tags";
import { debugEnabled } from "../state/debugEnabled";

const MAX_DISPLAY_ORDER = 2147483647;
const GROUP_ID = 33149057;
const DEBUG_RANK = 253;

function authorize(player: Player): boolean {
	return RunService.IsStudio() || player.GetRankInGroup(GROUP_ID) >= DEBUG_RANK;
}

let connections:
	| {
		[index: string]: RBXScriptConnection;
	}
	| undefined;

/**
 * Starts the ECS.
 *
 * @param host - The host the ECS is running on
 * @return The world and global ECS state of the ECS
 *
 * @throws "ECS already running."
 * This is thrown when the ECS has already been started.
 */
export function start(host: Host): [World, RootProducer] {
	if (connections) throw "ECS already running.";

	const world = new World();
	const debug = new Debugger(Plasma);
	debug.authorize = authorize;

	debug.findInstanceFromEntity = (id: AnyEntity): Instance | undefined => {
		if (!world.contains(id)) return;
		const model = world.get(id, Model);
		return model?.model;
	};

	const loop = new Loop(world, state, debug.getWidgets());
	startSystems(host, loop, debug);
	debug.autoInitialize(loop);

	connections = loop.begin({
		default: RunService.Heartbeat,
		stepped: RunService.Stepped,
	});

	if (host === Host.All || host === Host.Server) {
		startTags(world, tags);
	}

	if (host === Host.All || host === Host.Client) {
		const serverDebugger = ReplicatedStorage.FindFirstChild("MatterDebugger");
		if (serverDebugger && serverDebugger.IsA("ScreenGui")) {
			serverDebugger.DisplayOrder = MAX_DISPLAY_ORDER;
		}

		const clientDebugger = Players.LocalPlayer.FindFirstChild("MatterDebugger");
		if (clientDebugger && clientDebugger.IsA("ScreenGui")) {
			clientDebugger.DisplayOrder = MAX_DISPLAY_ORDER;
		}

		UserInputService.InputBegan.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.F4 && authorize(Players.LocalPlayer)) {
				debug.toggle();
				debugEnabled.toggle();
			}
		});
	}

	return [world, state];
}

/**
 * Stops the ECS.
 */
export function stop(): void {
	if (!connections) return;
	for (const [_, connection] of pairs(connections)) {
		connection.Disconnect();
	}
	connections = undefined;
	stopTags();
	stopSystems();
	ReplicatedStorage.FindFirstChild("MatterDebuggerRemote")?.Destroy();
}