import { BroadcastAction } from "@rbxts/reflex";
import { Route, Configuration } from "@rbxts/yetanothernet";

const defaultConfig: Configuration = {
	Channel: "Reliable",
	Event: "default",
};

export const matterReplication = new Route(defaultConfig);
export const reflexReplication = {
	broadcast: new Route<[actions: BroadcastAction[]]>(defaultConfig),
	start: new Route(defaultConfig),
};
