import { BroadcastAction } from "@rbxts/reflex";
import Net from "../../shared/packages/net";

export const { Client: client, Server: server } = Net.CreateDefinitions({
	broadcast: Net.Definitions.ServerToClientEvent<[actions: BroadcastAction[]]>(),
	start: Net.Definitions.ClientToServerEvent(),
});
