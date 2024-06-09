import { ChickynoidCommand } from "../simulation/command";

export enum CrunchTableEnum {
	FLOAT = 1,
	VECTOR3,
	INT32,
	UBYTE,
}

export type Commands = {
	localFrame: CrunchTableEnum.INT32;
	serverTime: CrunchTableEnum.FLOAT;
	deltaTime: CrunchTableEnum.FLOAT;
	snapshotServerFrame: CrunchTableEnum.INT32;
	playerStateFrame: CrunchTableEnum.INT32;

	shiftLock?: CrunchTableEnum.UBYTE;
	x: CrunchTableEnum.FLOAT;
	y: CrunchTableEnum.FLOAT;
	z: CrunchTableEnum.FLOAT;

	fa?: CrunchTableEnum.VECTOR3;
	reset?: CrunchTableEnum.UBYTE;
	running?: CrunchTableEnum.UBYTE;
};

export interface CommandLayout {
	pairTable: { field: keyof Commands; enum: CrunchTableEnum };
	totalBytes: number;
	Add: (field: keyof Commands, crunchTableEnum: CrunchTableEnum) => void;
}

export namespace CrunchTable {
	export function CreateLayout(this: typeof CrunchTable): CommandLayout;
	export function BinaryEncodeTable(
		this: typeof CrunchTable,
		srcData: ChickynoidCommand,
		layout: CommandLayout,
	): ChickynoidCommand;
	export function BinaryDecodeTable(
		this: typeof CrunchTable,
		srcData: ChickynoidCommand,
		layout: CommandLayout,
	): ChickynoidCommand;
}
