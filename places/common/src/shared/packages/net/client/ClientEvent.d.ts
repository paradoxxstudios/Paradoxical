/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
import { DefinitionConfiguration } from "../definitions";
/**
 * Interface for client listening events
 */
export interface ClientListenerEvent<CallArguments extends ReadonlyArray<unknown>> {
    /**
     * Connects a callback function to this event, in which if any events are recieved by the server will be called.
     * @param callback The callback function
     */
    Connect(callback: (...args: CallArguments) => void): RBXScriptConnection;
}
/**
 * Interface for client sender events
 */
export interface ClientSenderEvent<CallArguments extends ReadonlyArray<unknown>> {
    /**
     * Sends an event to the server with the specified arguments
     * @param args The arguments
     */
    SendToServer(...args: CallArguments): void;
}
declare class ClientEvent<ConnectArgs extends ReadonlyArray<unknown> = Array<unknown>, CallArguments extends ReadonlyArray<unknown> = Array<unknown>> implements ClientListenerEvent<ConnectArgs>, ClientSenderEvent<CallArguments> {
    private configuration;
    private instance;
    constructor(name: string, configuration: DefinitionConfiguration);
    /** @deprecated */
    GetInstance(): RemoteEvent<Callback>;
    static Wait<ConnectArgs extends ReadonlyArray<unknown> = Array<unknown>, CallArguments extends ReadonlyArray<unknown> = Array<unknown>>(name: string, configuration: DefinitionConfiguration): Promise<ClientEvent<ConnectArgs, CallArguments>>;
    SendToServer(...args: CallArguments): void;
    Connect(callback: (...args: ConnectArgs) => void): RBXScriptConnection;
}
export default ClientEvent;
