/// <reference types="@rbxts/compiler-types" />
import { DefinitionConfiguration } from "../definitions";
export default class ClientFunction<CallArgs extends ReadonlyArray<unknown>, ServerReturnType = unknown> {
    private name;
    private configuration;
    private instance;
    constructor(name: string, configuration: DefinitionConfiguration);
    static Wait<CallArgs extends ReadonlyArray<unknown> = Array<unknown>, ServerReturnType = unknown>(name: string, configuration: DefinitionConfiguration): Promise<ClientFunction<CallArgs, ServerReturnType>>;
    /**
     * Will call the server synchronously
     * @param args The call arguments
     */
    CallServer(...args: CallArgs): ServerReturnType;
    /**
     * Will call the server asynchronously
     * @param args The call arguments
     */
    CallServerAsync(...args: CallArgs): Promise<ServerReturnType>;
}
