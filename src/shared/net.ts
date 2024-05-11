import { defineNamespace, definePacket, map, optional, struct, unknown, string as str } from "@rbxts/bytenet";

export const matterReplication = defineNamespace("matterReplication", () => {
	return {
		replication: definePacket({
			value: map(str, map(str, struct({ data: optional(map(str, unknown)) }))),
			reliabilityType: "reliable",
		}),
	};
});
