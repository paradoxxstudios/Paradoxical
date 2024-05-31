import {
	defineNamespace,
	definePacket,
	map,
	optional,
	struct,
	unknown,
	string as str,
	uint8,
	bool,
} from "@rbxts/bytenet";

export const matterReplication = defineNamespace("matterReplication", () => {
	return {
		replication: definePacket({
			value: map(str, map(str, struct({ data: optional(map(str, unknown)) }))),
			reliabilityType: "reliable",
		}),
	};
});

export const commands = defineNamespace("commands", () => {
	return {
		handleCommands: definePacket({
			value: struct({
				id: uint8,
				input: bool,
			}),
			reliabilityType: "reliable",
		}),
	};
});
