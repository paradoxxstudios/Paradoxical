import "./dev";

import { createRoot, createPortal } from "@rbxts/react-roblox";
import React from "@rbxts/react";
import { Players } from "@rbxts/services";

import { App } from "./app";

const root = createRoot(new Instance("Folder"));
const target = Players.LocalPlayer.WaitForChild("PlayerGui");

root.render(
	createPortal(
		<React.StrictMode>
			<App key="app" />
		</React.StrictMode>,
		target,
	),
);
