/// <reference types="@rbxts/compiler-types" />
import { AsyncServerFunctionDeclaration, BidirectionalEventDeclaration, ClientToServerEventDeclaration, DeclarationsOf, FilterGroups, InferServerCallback, InferServerConnect, InferServerRemote, RemoteDeclarations, FilterServerDeclarations } from "./Types";
import { InferDefinition } from "./NamespaceBuilder";
import { DefinitionConfiguration } from ".";
declare type ServerEventDeclarationKeys<T extends RemoteDeclarations> = keyof DeclarationsOf<FilterServerDeclarations<T>, ClientToServerEventDeclaration<any> | BidirectionalEventDeclaration<any, any>> & string;
declare type ServerEventConnectFunction<T extends RemoteDeclarations, K extends keyof T> = InferServerConnect<Extract<T[K], ClientToServerEventDeclaration<any> | BidirectionalEventDeclaration<any, any>>>;
declare type ServerFunctionDeclarationKeys<T extends RemoteDeclarations> = keyof DeclarationsOf<FilterServerDeclarations<T>, AsyncServerFunctionDeclaration<any, any>> & string;
declare type ServerFunctionCallbackFunction<T extends RemoteDeclarations, K extends keyof T> = InferServerCallback<Extract<T[K], AsyncServerFunctionDeclaration<any, any>>>;
export interface ServerDefinitionConfig extends DefinitionConfiguration {
}
export declare class ServerDefinitionBuilder<T extends RemoteDeclarations> {
    private config;
    private namespace;
    private globalMiddleware?;
    constructor(declarations: T, config: ServerDefinitionConfig, namespace?: string);
    /**
     * Connects a callback function to this event, in which if any events are recieved by the client will be called.
     *
     * @param name The name
     * @param fn The callback
     *
     * Shortcut for:
     * ```ts
     * Declaration.Server.Get(name).Connect(fn)
     * ```
     */
    OnEvent<K extends ServerEventDeclarationKeys<T>>(name: K, fn: ServerEventConnectFunction<T, K>): Readonly<import("../server/NetServerScriptSignal").NetServerSignalConnection>;
    /**
     * Gets the specified group as a definition builder
     * @param namespaceId The name of the group
     *
     * ```ts
     * const FeatureA = Remotes.Server.Group("FeatureA");
     * const FeatureAEvent = FeatureA.Get("FeatureAEvent");
     * ```
     *
     */
    GetNamespace<K extends keyof FilterGroups<T> & string>(namespaceId: K): ServerDefinitionBuilder<InferDefinition<T[K]>>;
    /**
     * Fetches the remote object with the specified id in this namespace.
     *
     * @param remoteId The remote id
     * @returns The server-side remote object
     *
     * @see {@link OnEvent}, {@link OnFunction} for nicer alternatives for event/callback handling.
     */
    Get<K extends keyof FilterServerDeclarations<T> & string>(remoteId: K): InferServerRemote<T[K]>;
    /**
     * Retrieves the specified server remote instance `remoteId` based on the definition and returns it.
     *
     * @param remoteId the id of the remote
     * @deprecated Use {@link Get}. Remotes are now automatically generated at runtime.
     *
     */
    Create<K extends keyof FilterServerDeclarations<T> & string>(remoteId: K): InferServerRemote<T[K]>;
    /**
     * Sets the callback that will be invoked when the client calls this function.
     *
     * The returned result will be returned to the client. If the callback is a Promise, it will only return a value if the promise is resolved.
     *
     * @param name The name
     * @param fn The callback
     *
     * Shortcut for:
     * ```ts
     * Declaration.Server.Create(name).SetCallback(fn)
     * ```
     */
    OnFunction<K extends ServerFunctionDeclarationKeys<T>>(name: K, fn: ServerFunctionCallbackFunction<T, K>): void;
}
export {};
