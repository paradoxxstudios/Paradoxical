export const enum ChickyEnumAnimations {
	Stop = 0,
	Idle = 1,
	Walk = 2,
	Run = 3,
	Push = 4,
	Jump = 5,
	Fall = 6,
}

export const enum ChickyEnumAnimationChannels {
	Channel0 = 0,
	Channel1 = 1,
	Channel2 = 2,
	Channel3 = 3,
}

export const enum ChickyEnumEvents {
	ChickynoidAdded = 0,
	ChickynoidRemoving = 1,
	Command = 2,
	State = 3,
	Snapshot = 4,
	WorldState = 5,
	CollisionData = 6,
	ResetConnection = 7,

	DebugBox = 11,
	PlayerDisconnected = 12,
}
