import { createCollection } from "@rbxts/lapis";
import { Players } from "@rbxts/services";
import { store } from "server/store";
import { selectPlayerData } from "shared/state/shared/selectors";
import { PlayerData, defaultPlayerData } from "shared/state/shared/slices/players";
import { validate } from "./validate";
import { userIdToName } from "./userIdToName";

// Required to allow interfaces to be used as the collection type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlayerDataSchema = PlayerData & Record<string, any>;

const collection = createCollection<PlayerDataSchema>("PlayerData", {
	defaultData: defaultPlayerData,
	validate: validate,
});

async function loadDefaultData(player: Player) {
	store.loadPlayerData(player.Name, defaultPlayerData);

	Promise.fromEvent(Players.PlayerRemoving, (p) => p === player).then(() => {
		store.closePlayerData(player.Name);
	});
}

async function loadPlayerData(player: Player) {
	if (player.UserId < 0) {
		// Lapis session locking may break in local test servers, which use
		// negative user IDs, so we just load the default data instead.
		return loadDefaultData(player);
	}

	try {
		const document = await collection.load(`${player.UserId}`);

		if (!player.IsDescendantOf(Players)) {
			return;
		}

		const unsubscribe = store.subscribe(selectPlayerData(player.Name), (data) => {
			if (data) document.write(data);
		});

		Promise.fromEvent(Players.PlayerRemoving, (p) => p === player).then(() => {
			document.close();
			unsubscribe();
			store.closePlayerData(player.Name);
		});

		store.loadPlayerData(player.Name, document.read());
	} catch (err) {
		warn(`Failed to load data for ${player.Name}: ${err}`);
		player.Kick("Failed to load data. If issues persists report to developers.");
	}
}

Players.PlayerAdded.Connect((player) => {
	userIdToName.set(player.UserId, player.Name);
	loadPlayerData(player);
});

for (const player of Players.GetPlayers()) {
	loadPlayerData(player);
}
