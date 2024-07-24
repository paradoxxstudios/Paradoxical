/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
import { DefinitionConfiguration } from ".";
import { InferDefinition } from "./NamespaceBuilder";
import { AsyncClientFunctionDeclaration, DeclarationsOf, FilterGroups, InferClientCallback, InferClientConnect, InferClientRemote, RemoteDeclarations, ServerToClientEventDeclaration, FilterClientDeclarations } from "./Types";
export declare class ClientDefinitionBuilder<T extends RemoteDeclarations> {
    private configuration?;
    private namespace;
    constructor(declarations: T, configuration?: DefinitionConfiguration | undefined, namespace?: string);
    /**
     * (Internally uses {@link WaitFor})
     *
     * Will yield the current thread until the remote is found, or after 60 seconds will error.
     *
     * If you want to fetch the remote asynchronously, please use {@link WaitFor} instead.
     *
     * @param remoteId The id of the remote
     *
     * @see {@link OnEvent}, {@link OnFunction} for nicer functional alternatives to grabbing remotes.
     */
    Get<K extends keyof FilterClientDeclarations<T> & string>(remoteId: K): InferClientRemote<T[K]>;
    /**
     * Gets the specified remote declaration group (or sub group) in which namespaced remotes can be accessed
     * @param namespaceId The group name
     */
    GetNamespace<K extends keyof FilterGroups<T> & string>(namespaceId: K): ClientDefinitionBuilder<InferDefinition<T[K]>>;
    private GetOrThrow;
    /**
     * Waits for the specified remote to exist, then returns it in a promises
     *
     * @param remoteId The remote id
     *
     * @see {@link OnEvent}, {@link OnFunction} for nicer functional alternatives to grabbing remotes.
     */
    WaitFor<K extends keyof FilterClientDeclarations<T> & string>(remoteId: K): Promise<InferClientRemote<T[K]>>;
    /**
     * Connects a callback function to this event, in which if any events are recieved by the server will be called.
     *
     * @param name The name
     * @param fn The callback
     *
     * Shortcut for:
     * ```ts
     * Declaration.Client.WaitFor(name).expect().Connect(fn)
     * ```
     */
    OnEvent<K extends keyof DeclarationsOf<FilterClientDeclarations<T>, ServerToClientEventDeclaration<unknown[]>> & string>(name: K, fn: InferClientConnect<Extract<T[K], ServerToClientEventDeclaration<unknown[]>>>): Promise<RBXScriptConnection>;
    /**
     * Sets the callback that will be invoked when the server calls this function.
     *
     * The returned result will be returned to the server. If the callback is a Promise, it will only return a value if the promise is resolved.
     *
     * @param name The name
     * @param fn The callback
     *
     * Shortcut for:
     * ```ts
     * Declaration.Client.WaitFor(name).expect().SetCallback(fn)
     * ```
     */
    OnFunction<K extends keyof DeclarationsOf<FilterClientDeclarations<T>, AsyncClientFunctionDeclaration<any, any>> & string>(name: K, fn: InferClientCallback<Extract<T[K], AsyncClientFunctionDeclaration<any, any>>>): Promise<void>;
}
