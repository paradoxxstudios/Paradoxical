import "./dev";

import { createRoot, createPortal } from "@rbxts/react-roblox";
import Roact, { StrictMode } from "@rbxts/roact";
import { Players } from "@rbxts/services";

import { App } from "./app";

const root = createRoot(new Instance("Folder"));
const target = Players.LocalPlayer.WaitForChild("PlayerGui");

root.render(
	createPortal(
		<StrictMode>
			<App key="app" />
		</StrictMode>,
		target,
	),
);
