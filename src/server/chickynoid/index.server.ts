/* eslint-disable prettier/prettier */
import { ChickynoidServer, ServerMods } from "@rbxts/chickynoid";
import { Players, ReplicatedFirst, ServerScriptService, Workspace } from "@rbxts/services";

ChickynoidServer.RecreateCollisions(Workspace.FindFirstChild("GameArea") as Instance);

ServerMods.RegisterMods(
	"servermods",
	ServerScriptService.FindFirstChild("paradoxical")?.FindFirstChild("chickynoid")?.FindFirstChild("mods") as Instance,
);
ServerMods.RegisterMods(
	"characters",
	ReplicatedFirst.FindFirstChild("chickynoid")?.FindFirstChild("characters") as Instance,
);
ServerMods.RegisterMods(
    "weapons", 
    ReplicatedFirst.FindFirstChild("chickynoid")?.FindFirstChild("weapons") as Instance
);

ChickynoidServer.Setup();
