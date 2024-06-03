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
	int8,
	cframe,
	nothing,
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
		movement: definePacket({
			value: struct({
				x: int8,
				y: int8,
			}),
			reliabilityType: "reliable",
		}),
	};
});

export const ledgeMovement = defineNamespace("ledgeMove", () => {
	return {
		jump: definePacket({
			value: nothing,
			reliabilityType: "reliable",
		}),
		move: definePacket({
			value: bool,
			reliabilityType: "reliable",
		}),
		grab: definePacket({
			value: nothing,
			reliabilityType: "reliable",
		}),
	};
});
