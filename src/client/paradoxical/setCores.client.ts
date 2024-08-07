import { Players } from "@rbxts/services";
import { coreCallback } from "shared/net";
import coreCall from "shared/utils/coreCall";

const resetBindable = new Instance("BindableEvent");
resetBindable.Event.Connect(() => {
	coreCallback.resetCallback.send();
	coreCall("SetCore", ...["ResetButtonCallback", false]);
});
Players.LocalPlayer.CharacterAdded.Connect(() => {
	coreCall("SetCore", ...["ResetButtonCallback", true]);
	coreCall("SetCore", ...["ResetButtonCallback", resetBindable]);
});
