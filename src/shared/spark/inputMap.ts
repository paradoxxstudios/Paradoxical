import { Actions, InputMap, VirtualAxis2d } from "@rbxts/spark";

export = new InputMap()
	.insert("move", VirtualAxis2d.wasd(), Enum.KeyCode.Thumbstick1)
	.insert("jump", Enum.KeyCode.Space, Enum.KeyCode.ButtonA) as unknown as InputMap<Actions<string[]>>;
