import { ChickynoidServer } from "@rbxts/chickynoid/types/Server";

function Setup(this: typeof useNicerHumanoid, server: typeof ChickynoidServer) {
	server.OnPlayerConnected.Connect((_, playerRecord) => {
		playerRecord.SetCharacterMod("nicerHumanoid");
	});
}

const useNicerHumanoid = { Setup: Setup };

export = useNicerHumanoid;
