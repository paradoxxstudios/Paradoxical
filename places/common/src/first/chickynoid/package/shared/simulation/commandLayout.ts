import { CommandLayout, Commands, CrunchTable as CrunchTableType } from "../vendor/crunchTable";

const CrunchTable = require(
	script.Parent?.Parent?.FindFirstChild("vendor")?.FindFirstChild("crunchTable") as ModuleScript,
) as typeof CrunchTableType;

interface CommandLayoutModule {
	commandLayout?: CommandLayout;

	GetCommandLayout: (this: CommandLayoutModule) => CommandLayout;
	EncodeCommand: (this: CommandLayoutModule, command: Commands) => Commands;
	DecodeCommand: (this: CommandLayoutModule, command: Commands) => Commands;
}

const module: CommandLayoutModule = {
	GetCommandLayout(this: typeof module) {
		if (this.commandLayout === undefined) {
			this.commandLayout = CrunchTable.CreateLayout();

			this.commandLayout.Add("localFrame", CrunchTable.Enum.INT32);
			this.commandLayout.Add("serverTime", CrunchTable.Enum.FLOAT);
			this.commandLayout.Add("deltaTime", CrunchTable.Enum.FLOAT);
			this.commandLayout.Add("snapshotServerFrame", CrunchTable.Enum.INT32);
			this.commandLayout.Add("playerStateFrame", CrunchTable.Enum.INT32);
			this.commandLayout.Add("shiftLock", CrunchTable.Enum.UBYTE);
			this.commandLayout.Add("x", CrunchTable.Enum.FLOAT);
			this.commandLayout.Add("y", CrunchTable.Enum.FLOAT);
			this.commandLayout.Add("z", CrunchTable.Enum.FLOAT);
			this.commandLayout.Add("fa", CrunchTable.Enum.VECTOR3);
			this.commandLayout.Add("f", CrunchTable.Enum.FLOAT);
			this.commandLayout.Add("j", CrunchTable.Enum.FLOAT);
			this.commandLayout.Add("reset", CrunchTable.Enum.UBYTE);
			this.commandLayout.Add("running", CrunchTable.Enum.UBYTE);
			this.commandLayout.Add("jumped", CrunchTable.Enum.UBYTE);
		}

		return this.commandLayout;
	},

	EncodeCommand(this: CommandLayoutModule, command: Commands) {
		return CrunchTable.BinaryEncodeTable(command, this.GetCommandLayout());
	},

	DecodeCommand(this: CommandLayoutModule, command: Commands) {
		return CrunchTable.BinaryDecodeTable(command, this.GetCommandLayout());
	},
};

export = module;
