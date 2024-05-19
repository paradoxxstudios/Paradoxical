import { createCollection } from "@rbxts/lapis";
import { Players } from "@rbxts/services";
import { store } from "server/store";
import { selectPlayerData } from "shared/state/shared/selectors";
import { SaveablePlayerData, defaultPlayerData } from "shared/state/shared/slices/players";
import { validate } from "./validate";

// Required to allow interfaces to be used as the collection type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlayerDataSchema = SaveablePlayerData & Record<string, any>;

const collection = createCollection<PlayerDataSchema>("PlayerData", {
	defaultData: defaultPlayerData,
	validate: validate,
});

async function loadDefaultData(player: Player) {
	store.loadPlayerHealth(player.UserId + "", defaultPlayerData);

	Promise.fromEvent(Players.PlayerRemoving, (p) => p === player).then(() => {
		store.closePlayerHealth(player.UserId + "");
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
			store.closePlayerHealth(player.UserId + "");
		});

		store.loadPlayerHealth(player.UserId + "", document.read());
	} catch (err) {
		warn(`Failed to load data for ${player.Name}: ${err}`);
		player.Kick("Failed to load data. If issues persists report to developers.");
	}
}

Players.PlayerAdded.Connect((player) => {
	loadPlayerData(player);
	store.loadAnimationPlayer(player.UserId + "");
	store.loadAnimationIdPlayer(player.UserId + "");
});

for (const player of Players.GetPlayers()) {
	loadPlayerData(player);
	store.closeAnimationPlayer(player.UserId + "");
	store.closeAnimationIdPlayer(player.UserId + "");
}
