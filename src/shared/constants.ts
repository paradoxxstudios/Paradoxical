import { Players, RunService } from "@rbxts/services";

export const IS_PLUGIN = RunService.IsStudio() && !RunService.IsRunning();
export const playerId = tostring(Players.LocalPlayer.UserId);