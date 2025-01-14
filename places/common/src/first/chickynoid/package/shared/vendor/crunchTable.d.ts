export type Commands = {
	localFrame: number;
	serverTime: number;
	deltaTime: number;
	snapshotServerFrame: number;
	playerStateFrame: number;

	x: number;
	y: number;
	z: number;
	moveDirection: Vector3;
	cameraLookVector: Vector3;

	f?: number;
	j?: number;
	fa: Vector3;
	reset?: number;
	running?: number;
	jumped?: number;

	dash?: number;

	model?: Model;
};

export interface CommandLayout {
	pairTable: { field: keyof Commands; enum: CrunchTable.Enum };
	totalBytes: number;
	Add: (this: CommandLayout, field: keyof Commands, crunchTableEnum: CrunchTable.Enum) => void;
}

export namespace CrunchTable {
	export enum Enum {
		FLOAT = 1,
		VECTOR3 = 2,
		INT32 = 3,
		UBYTE = 4,
	}
	export function CreateLayout(this: typeof CrunchTable): CommandLayout;
	export function BinaryEncodeTable(this: typeof CrunchTable, srcData: Commands, layout: CommandLayout): Commands;
	export function BinaryDecodeTable(this: typeof CrunchTable, srcData: Commands, layout: CommandLayout): Commands;
}
