/// <reference types="@rbxts/compiler-types" />
import { MiddlewareOverload, NetGlobalMiddleware } from "../middleware";
import { FunctionDeclaration, RemoteDeclarations, DefinitionsCreateResult, NamespaceDeclaration, ServerToClientEventDeclaration, ClientToServerEventDeclaration, BidirectionalEventDeclaration, AsyncServerFunctionDeclaration, AsyncClientFunctionDeclaration, ExperienceBroadcastEventDeclaration } from "./Types";
import { NamespaceConfiguration } from "./NamespaceBuilder";
export interface DefinitionConfiguration {
    /**
     * Middleware that's applied to _all_ remotes on the server
     *
     * @default undefined
     */
    readonly ServerGlobalMiddleware?: NetGlobalMiddleware[];
    /**
     * Whether or not the server remotes are automatically generated
     *
     * This will default to `true` if the top-level definition, or the value of the parent namespace.
     *
     * @default true
     */
    readonly ServerAutoGenerateRemotes?: boolean;
    /**
     * Whether or not `Client.Get(...)` should yield for the remote to exist
     *
     * If `true` - Will yield until the remote exists, or error after 60 seconds.
     *
     * If `false` - Will error if the remote does not exist.
     *
     * @default true
     */
    readonly ClientGetShouldYield?: boolean;
    /**
     * Add a microprofiler debug label to each callback
     */
    readonly MicroprofileCallbacks?: boolean;
}
declare namespace NetDefinitions {
    /**
     * Creates definitions for Remote instances that can be used on both the client and server.
     * @description https://docs.vorlias.com/rbx-net/docs/3.0/definitions#definitions-oh-my
     * @param declarations
     */
    function Create<T extends RemoteDeclarations>(declarations: T, configuration?: DefinitionConfiguration): DefinitionsCreateResult<T>;
    /**
     * Defines a namespace of remote definitions, which can be retrieved via `GetNamespace(namespaceId)`
     *
     * E.g.
     * ```ts
     * const Remotes = Net.Definitions.Create({
     * 		ExampleGroup: Net.Definitions.Namespace({
     * 			ExampleGroupRemote: Net.Definitions.ServerToClientEvent<[message: string]>(),
     * 		}),
     * });
     * const ExampleGroupRemote = Remotes.Server.GetNamespace("ExampleGroup").Create("ExampleGroupRemote");
     * ```
     *
     * This is useful for categorizing remotes by feature.
     */
    function Namespace<T extends RemoteDeclarations>(declarations: T, configuration?: NamespaceConfiguration): NamespaceDeclaration<T>;
    /**
     * Defines a function in which strictly the client can call the server asynchronously
     *
     * `Client` [`Calls`] -> `Server` [`Recieves Call`]
     * ... (asynchronously) ...
     * `Server` [`Responds to Call`] -> `Client` [`Recieves Response`]
     */
    function ServerAsyncFunction<ServerFunction extends (...args: any[]) => unknown = (...args: unknown[]) => unknown>(mw?: MiddlewareOverload<Parameters<ServerFunction>>): AsyncServerFunctionDeclaration<Parameters<ServerFunction>, ReturnType<ServerFunction>>;
    /**
     * @version 3.0
     *
     * **_Note_: This uses {@link MessagingService}, and thus is subject to those quotas/limits.**
     *
     * **_Note_: Unlike other definitions in Net, this is only available on the server.**
     *
     * Defines an event in which allows broadcasting messages between servers in the experience.
     *
     * `Source Server` [`Broadcasts`] -> `Other Servers` [`Recieves Broadcast`]
     *
     * or at a target {@link DataModel.JobId JobId}
     *
     * `Source Server [`Broadcasts`] -> `Target Server` [`Recieves Broadcast`]
     *
     */
    function ExperienceBroadcastEvent<ServerArgs extends defined = defined>(): ExperienceBroadcastEventDeclaration<ServerArgs>;
    /**
     * Defines a function in which strictly the server can call the client asynchronously
     *
     * `Server` [`Calls`] -> `Client` [`Recieves Call`]
     * ... (asynchronously) ...
     * `Client` [`Responds to Call`] -> `Server` [`Recieves Response`]
     */
    function ClientAsyncFunction<ClientFunction extends (...args: any[]) => defined = (...args: unknown[]) => defined>(): AsyncClientFunctionDeclaration<Parameters<ClientFunction>, ReturnType<ClientFunction>>;
    /**
     * Defines a regular function in which strictly the client can call the server synchronously
     *
     * (Synchronous) `Client` [`Calls`, `Recieves Response`] <- (yields for response) -> `Server` [`Recieves Call`, `Responds`]
     */
    function ServerFunction<ServerFunction extends (...args: any[]) => any>(mw?: MiddlewareOverload<Parameters<ServerFunction>>): FunctionDeclaration<Parameters<ServerFunction>, ReturnType<ServerFunction>>;
    /**
     * Defines an event in which strictly the server fires an event that is recieved by clients
     *
     * `Server` [`Sends`] => `Client(s)` [`Recieves`]
     *
     * On the client, this will give an event that can use `Connect`.
     *
     * On the server, this will give an event that can use `SendToPlayer`, `SendToAllPlayers`, `SendToAllPlayersExcept`
     *
     */
    function ServerToClientEvent<ServerArgs extends readonly unknown[] = unknown[]>(): ServerToClientEventDeclaration<ServerArgs>;
    /**
     * Defines an event in which strictly clients fire an event that's recieved by the server
     *
     * `Client(s)` [`Sends`] => `Server` [`Recieves`]
     *
     * On the client, this will give an event that can use `SendToServer`.
     *
     * On the server, this will give an event that can use `Connect`.
     *
     * @param mw The middleware of this event.
     */
    function ClientToServerEvent<ClientArgs extends readonly unknown[] = unknown[]>(): ClientToServerEventDeclaration<ClientArgs>;
    function ClientToServerEvent<ClientArgs extends readonly unknown[]>(mw?: MiddlewareOverload<ClientArgs>): ClientToServerEventDeclaration<ClientArgs>;
    /**
     * Defines a remote event that can be fired both from the client and server
     *
     * This should only be required in rare use cases where `ClientToServerEvent` or `ServerToClientEvent` is not sufficient.
     *
     * Check to see if {@link ServerAsyncFunction} is more sufficient for your use case.
     */
    function BidirectionalEvent<ServerConnect extends readonly unknown[] = unknown[], ClientConnect extends readonly unknown[] = unknown[]>(): BidirectionalEventDeclaration<ServerConnect, ClientConnect>;
    function BidirectionalEvent<ServerConnect extends readonly unknown[] = unknown[], ClientConnect extends readonly unknown[] = unknown[]>(mw?: MiddlewareOverload<ServerConnect>): BidirectionalEventDeclaration<ServerConnect, ClientConnect>;
}
export default NetDefinitions;
