import { Actions, InputMap, VirtualAxis2d } from "@rbxts/spark";

export = new InputMap()
	.insert("move", VirtualAxis2d.wasd(), Enum.KeyCode.Thumbstick1)
	.insert("jump", Enum.KeyCode.Space, Enum.KeyCode.ButtonA)
	.insert("crouch", Enum.KeyCode.C)
	.insert("run", Enum.KeyCode.LeftShift, Enum.KeyCode.RightShift)
	.insert("dash", Enum.KeyCode.Q) as unknown as InputMap<Actions<string[]>>;
