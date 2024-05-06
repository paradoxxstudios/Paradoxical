/* eslint-disable prettier/prettier */
import { ChickynoidClient } from "@rbxts/chickynoid";
import { ClientMods } from "@rbxts/chickynoid";
import { ReplicatedFirst } from "@rbxts/services";

ClientMods.RegisterMods(
	"clientmods",
	ReplicatedFirst.FindFirstChild("chickynoid")?.FindFirstChild("clientMods") as Instance,
);
ClientMods.RegisterMods(
	"characters",
	ReplicatedFirst.FindFirstChild("chickynoid")?.FindFirstChild("characters") as Instance,
);
ClientMods.RegisterMods(
	"weapons",
	ReplicatedFirst.FindFirstChild("chickynoid")?.FindFirstChild("weapons") as Instance,
);

ChickynoidClient.Setup();
