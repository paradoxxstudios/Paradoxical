import { Route, Configuration } from "@rbxts/yetanothernet";

const defaultConfig: Configuration = {
	Channel: "Reliable",
	Event: "default",
};

export const matterReplication = new Route(defaultConfig);
