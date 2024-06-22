import { Players } from "@rbxts/services";
import { store } from "../../server/store";
import { selectPlayerData } from "../../shared/store/shared/selectors";
import { SaveablePlayerData, defaultPlayerData } from "../../shared/store/shared/slices/players";
import { validate } from "./validate";
import DataStoreWrapper from "./dataStore";
import { createCollection, setConfig } from "../../shared/packages/lapis";

// Required to allow interfaces to be used as the collection type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlayerDataSchema = SaveablePlayerData & Record<string, any>;

setConfig({
	dataStoreService: DataStoreWrapper,
});

const collection = createCollection<PlayerDataSchema>("PlayerData", {
	defaultData: defaultPlayerData,
	validate: validate,
});

function handlePlayerDatas(player: Player, option: string) {
	for (const data of pairs(store)) {
		const key = data[0];
		if (key.size() >= option.size() + 6 && key.sub(0, 4) === option && key.sub(key.size() - 5) === "Player") {
			(data[1] as (player: string) => void)(player.UserId + "");
		}
	}
}

function loadSaveablePlayerDatas(player: Player, data: SaveablePlayerData) {
	for (const result of pairs(store)) {
		const key = result[0];
		if (key.size() >= 10 && key.sub(0, 10) === "loadPlayer") {
			(result[1] as (player: string, data: SaveablePlayerData) => void)(player.UserId + "", data);
		}
	}
}

function closeSaveablePlayerDatas(player: Player) {
	for (const result of pairs(store)) {
		const key = result[0];
		if (key.size() >= 11 && key.sub(0, 10) === "closePlayer") {
			(result[1] as (player: string) => void)(player.UserId + "");
		}
	}
}

async function loadDefaultData(player: Player) {
	loadSaveablePlayerDatas(player, defaultPlayerData);

	Promise.fromEvent(Players.PlayerRemoving, (p) => p === player).then(() => {
		closeSaveablePlayerDatas(player);
	});
}

async function loadPlayerData(player: Player) {
	if (player.UserId < 0) {
		// Lapis session locking may break in local test servers, which use
		// negative user IDs, so we just load the default data instead.
		return loadDefaultData(player);
	}

	try {
		const document = await collection.load(`${player.UserId}`, [player.UserId]); // FOR GDPR compliance.

		if (!player.IsDescendantOf(Players)) {
			return;
		}

		const unsubscribe = store.subscribe(selectPlayerData(player.UserId + ""), (data) => {
			if (data) document.write(data);
		});

		Promise.fromEvent(Players.PlayerRemoving, (p) => p === player).then(() => {
			document.close();
			unsubscribe();
			closeSaveablePlayerDatas(player);
			handlePlayerDatas(player, "close");
		});

		loadSaveablePlayerDatas(player, document.read());
	} catch (err) {
		warn(`Failed to load data for ${player.Name}: ${err}`);
		player.Kick("Failed to load data. If issues persists report to developers.");
	}
}

Players.PlayerAdded.Connect((player) => {
	loadPlayerData(player);
	handlePlayerDatas(player, "load");
});

for (const player of Players.GetPlayers()) {
	loadPlayerData(player);
	handlePlayerDatas(player, "load");
}
