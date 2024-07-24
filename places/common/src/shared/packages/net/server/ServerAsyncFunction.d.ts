/// <reference types="@rbxts/types" />
/// <reference types="@rbxts/compiler-types" />
import MiddlewareEvent, { MiddlewareList } from "./MiddlewareEvent";
import { DefinitionConfiguration } from "../definitions";
export interface ServerAsyncCallback<CallbackArgs extends readonly unknown[], CallbackReturnType> {
    /**
     * Sets the callback that will be invoked when the client calls this function.
     *
     * The returned result will be returned to the client. If the callback is a Promise, it will only return a value if the promise is resolved.
     *
     * @param callback The callback
     */
    SetCallback<R extends CallbackReturnType>(callback: (player: Player, ...args: CallbackArgs) => R): void;
    SetCallback<R extends Promise<CallbackReturnType>>(callback: (player: Player, ...args: CallbackArgs) => R): void;
}
export interface ServerAsyncCaller<CallArgs extends readonly unknown[], CallReturnType> {
    /**
     * Calls the specified player with the given arguments, and returns the result as a promise.
     *
     * ### NOTE: Any values returned from the client should be verified! ensure the result you're given is correct!
     *
     * @param player The player to call
     * @param args The arguments
     */
    CallPlayerAsync(player: Player, ...args: CallArgs): Promise<CallReturnType>;
    /**
     * Sets the call timeout for this caller. If the timeout is reached, the promise from the calling function will reject.
     * @param timeout The timeout (in seconds)
     */
    SetCallTimeout(timeout: number): this;
    /**
     * Gets the call timeout (in seconds) that this remote will wait before rejecting if no response is recieved
     */
    GetCallTimeout(): number;
}
/**
 * An asynchronous function for two way communication between the client and server
 */
declare class ServerAsyncFunction<CallbackArgs extends ReadonlyArray<unknown> = Array<unknown>, CallArgs extends ReadonlyArray<unknown> = Array<unknown>, CallReturnType = unknown, CallbackReturnType = unknown> extends MiddlewareEvent implements ServerAsyncCallback<CallbackArgs, CallbackReturnType>, ServerAsyncCaller<CallArgs, CallReturnType> {
    private configuration;
    private instance;
    private timeout;
    private connector;
    private listeners;
    private defaultHook?;
    constructor(name: string, middlewares: MiddlewareList | undefined, configuration: DefinitionConfiguration);
    SetCallTimeout(timeout: number): this;
    GetCallTimeout(): number;
    /**
     * Set the callback for this Async Function
     * @param callback The callback
     */
    SetCallback<R extends CallbackReturnType>(callback: (player: Player, ...args: CallbackArgs) => R): void;
    /**
     * Calls the specified player, with the given values
     * @param player The player to call
     * @param args The arguments to send to the player
     * @returns Promise with the result of what's recieved with the player
     * @throws A rejection if the call times out
     */
    CallPlayerAsync(player: Player, ...args: CallArgs): Promise<CallReturnType>;
}
export default ServerAsyncFunction;
