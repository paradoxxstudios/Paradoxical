/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyEntity, Debugger, Loop, World } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";
import { Players, ReplicatedStorage, RunService, ServerScriptService, UserInputService } from "@rbxts/services";

import { Host } from "shared/hosts";
import { tags } from "./boundTags";
import { Model } from "./components";
import { start as startSystems, stop as stopSystems } from "./systems";
import { start as startTags, stop as stopTags } from "./tags";
import { CombineProducers, combineProducers } from "@rbxts/reflex";

import { store as clientStore, RootProducer as ClientRootProducer, RootProducer } from "shared/state/client";
import recieveReplication from "./recieveReplication";
import { SparkState, sparkState } from "shared/spark";
import { StateType } from "./types";
const serverStoreModule = ServerScriptService.FindFirstChild("store") as ModuleScript;

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
export function start(host: Host): [World, StateType] {
	if (connections) throw "ECS already running.";

	const world = new World();
	const debug = new Debugger(Plasma);
	debug.authorize = authorize;

	debug.findInstanceFromEntity = (id: AnyEntity): Instance | undefined => {
		if (!world.contains(id)) return;
		const model = world.get(id, Model);
		return model?.model;
	};

	const state: { reflex?: CombineProducers<{}> | ClientRootProducer; spark?: SparkState } = {};
	state.spark = sparkState;
	if (host === Host.Client) {
		state.reflex = clientStore;
	} else if (host === Host.Server) {
		const serverStore = (
			require(serverStoreModule) as {
				store: CombineProducers<any>;
			}
		).store;
		state.reflex = serverStore;
	} else {
		state.reflex = combineProducers({});
	}
	const loop = new Loop(world, state, debug.getWidgets());
	startSystems(host, loop, debug);
	debug.autoInitialize(loop);

	const runServices: { [index: string]: RBXScriptSignal<(deltaTime: number) => void> } = {
		default: RunService.Heartbeat,
		stepped: RunService.Stepped,
	};

	if (host === Host.All || host === Host.Server) {
		connections = loop.begin(runServices);
		startTags(world, tags);
	}

	if (host === Host.All || host === Host.Client) {
		connections = loop.begin({ ...runServices, renderedStepped: RunService.RenderStepped });
		recieveReplication(world, state as StateType);

		const serverDebugger = ReplicatedStorage.FindFirstChild("MatterDebugger");
		if (serverDebugger && serverDebugger.IsA("ScreenGui")) {
			serverDebugger.DisplayOrder = MAX_DISPLAY_ORDER;
		}

		const clientDebugger = Players.LocalPlayer.FindFirstChild("MatterDebugger");
		if (clientDebugger && clientDebugger.IsA("ScreenGui")) {
			clientDebugger.DisplayOrder = MAX_DISPLAY_ORDER;
		}

		const clientState: ClientRootProducer = state.reflex as ClientRootProducer;
		UserInputService.InputBegan.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.F4 && authorize(Players.LocalPlayer)) {
				debug.toggle();
				clientState.toggle();
			}
		});
	}

	return [world, state as StateType];
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
