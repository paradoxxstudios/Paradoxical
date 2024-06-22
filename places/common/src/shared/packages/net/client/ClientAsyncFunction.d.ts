/// <reference types="@rbxts/compiler-types" />
import { DefinitionConfiguration } from "../definitions";
export interface ClientAsyncCallback<CallbackArgs extends readonly unknown[], CallbackReturnType> {
    /**
     * Sets the callback that will be invoked when the server calls this function.
     *
     * The returned result will be returned to the server. If the callback is a Promise, it will only return a value if the promise is resolved.
     *
     * @param callback The callback
     */
    SetCallback<R extends CallbackReturnType>(callback: (...args: CallbackArgs) => R): void;
    SetCallback<R extends Promise<CallbackReturnType>>(callback: (...args: CallbackArgs) => R): void;
}
export interface ClientAsyncCaller<CallArgs extends readonly unknown[], CallReturnType> {
    /**
     * Calls the server with the given arguments and returns the result from the server as a promise.
     * @param args The arguments to the function
     */
    CallServerAsync(...args: CallArgs): Promise<CallReturnType>;
    /**
     * Sets the call timeout for this caller. If the timeout is reached, the promise from the calling function will reject.
     * @param timeout The timeout (in seconds)
     */
    SetCallTimeout(timeout: number): void;
    /**
     * Gets the call timeout (in seconds) that this remote will wait before rejecting if no response is recieved
     */
    GetCallTimeout(): number;
}
/**
 * An event that behaves like a function
 * @rbxts client
 */
export default class ClientAsyncFunction<CallbackArgs extends ReadonlyArray<unknown> = Array<unknown>, CallArgs extends ReadonlyArray<unknown> = Array<unknown>, CallReturnType = unknown, CallbackReturnType = unknown> implements ClientAsyncCallback<CallbackArgs, CallbackReturnType>, ClientAsyncCaller<CallArgs, CallReturnType> {
    private name;
    private configuration;
    private instance;
    private timeout;
    private connector;
    private listeners;
    constructor(name: string, configuration: DefinitionConfiguration);
    static Wait<CallbackArgs extends ReadonlyArray<unknown> = Array<unknown>, CallArgs extends ReadonlyArray<unknown> = Array<unknown>, ServerReturnType = unknown>(name: string, configuration: DefinitionConfiguration): Promise<ClientAsyncFunction<CallbackArgs, CallArgs, ServerReturnType, unknown>>;
    SetCallTimeout(timeout: number): void;
    GetCallTimeout(): number;
    SetCallback<R extends CallbackReturnType>(callback: (...args: CallbackArgs) => R): void;
    CallServerAsync(...args: CallArgs): Promise<CallReturnType>;
}
