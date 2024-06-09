import { CommandLayout, CrunchTable } from "../vendor/crunchTable";
import { ChickynoidCommand } from "./command";

interface CommandLayoutModule {
    commandLayout?: CommandLayout;

    GetCommandLayout: (this: CommandLayoutModule) => CommandLayout;
    EncodeCommand: (this: CommandLayoutModule, command: ChickynoidCommand) => ChickynoidCommand,
    DecodeCommand: (this: CommandLayoutModule, command: ChickynoidCommand) => ChickynoidCommand,
}

function GetCommandLayout(this: CommandLayoutModule) {
    if (this.commandLayout === undefined) {
        this.commandLayout = CrunchTable.CreateLayout();

        this.commandLayout.Add()
    }
}

export = {
    GetCommandLayout: GetCommandLayout,
    
};
