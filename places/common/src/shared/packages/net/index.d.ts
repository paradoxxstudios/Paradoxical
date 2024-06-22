import * as NetServerContext from "./server";
import * as NetClientContext from "./client";
import NetDefinitions, { DefinitionConfiguration } from "./definitions";
import { NetMiddleware } from "./middleware";
import { ClientBuildResult, DefinitionsCreateResult, FilterClientDeclarations, FilterGroups, FilterServerDeclarations, NamespaceDeclaration, RemoteDeclarations, ServerBuildResult } from "./definitions/Types";
/**
 * Networking Library for Roblox
 * @version 3.0
 */
declare namespace Net {
    /**
     * Legacy client API for Net
     * @deprecated
     */
    const Client: typeof NetClientContext;
    /**
     * Legacy server API for Net
     * @deprecated
     */
    const Server: typeof NetServerContext;
    /**
     * The definitions API for Net
     */
    const Definitions: typeof NetDefinitions;
    /**
     * Utility types for Net
     */
    namespace Util {
        /**
         * Returns a `key -> value` type map of remotes in the specified declaration, mapped to server objects.
         *
         * ```ts
         * type GlobalNamespace = Net.Util.GetDeclarationDefinitions<typeof Remotes>;
         * type ServerGlobalRemotes = Net.Util.GetServerRemotes<GlobalNamespace>;
         * ```
         */
        type GetServerRemotes<T extends RemoteDeclarations> = ServerBuildResult<FilterServerDeclarations<T>>;
        /**
         * Returns a `key -> value` type map of remotes in the specified declaration, mapped to client objects.
         *
         * ```ts
         * type GlobalNamespace = Net.Util.GetDeclarationDefinitions<typeof Remotes>;
         * type ClientGlobalRemotes = Net.Util.GetClientRemotes<GlobalNamespace>;
         * ```
         */
        type GetClientRemotes<T extends RemoteDeclarations> = ClientBuildResult<FilterClientDeclarations<T>>;
        /**
         * Returns the sub declaration of a declaration based on the given namespace
         *
         * ```ts
         * type GlobalNamespace = Net.Util.GetDeclarationDefinitions<typeof Remotes>;
         * type ExampleNamespace = Net.Util.GetNamespaceDefinitions<GlobalNamespace, "Example">;
         * ```
         */
        type GetNamespaceDefinitions<T extends RemoteDeclarations, K extends keyof FilterGroups<T>> = T[K] extends NamespaceDeclaration<infer A> ? A : never;
        /**
         * Gets the definitions type for the given definition
         *
         * e.g.
         * ```ts
         * type RemoteDefinitions = Net.Util.GetDeclarationDefinitions<typeof Remotes>;
         * ```
         */
        type GetDeclarationDefinitions<T extends DefinitionsCreateResult<RemoteDeclarations>> = T extends DefinitionsCreateResult<infer U> ? U : never;
        /**
         * Gets the keys for each remote item in a definition
         *
         * ```ts
         * type RemoteIds = Net.Util.GetRemoteKeys<typeof Remotes>;
         * ```
         */
        type GetClientRemoteKeys<T extends DefinitionsCreateResult<any>> = T extends DefinitionsCreateResult<infer A> ? keyof FilterClientDeclarations<A> : never;
        /**
         * Gets the keys for each remote item in a definition
         *
         * ```ts
         * type RemoteIds = Net.Util.GetRemoteKeys<typeof Remotes>;
         * ```
         */
        type GetServerRemoteKeys<T extends DefinitionsCreateResult<any>> = T extends DefinitionsCreateResult<infer A> ? keyof FilterServerDeclarations<A> : never;
        /**
         * Gets the keys for each definition namespace in a definition
         *
         * ```ts
         * type NamespaceIds = Net.Util.GetNamespaceKeys<typeof Remotes>;
         * ```
         */
        type GetNamespaceKeys<T extends DefinitionsCreateResult<any>> = T extends DefinitionsCreateResult<infer A> ? keyof FilterGroups<A> : never;
    }
    const DIST: string;
    /**
     * The version of RbxNet
     */
    const VERSION: string;
    /**
     * Built-in middlewares
     */
    const Middleware: typeof NetMiddleware;
    /**
     * Middleware function type for Net
     */
    type Middleware = NetMiddleware;
    /**
     * Short-hand for `Net.Definitions.Create`
     * @see {@link Definitions.Create}
     */
    function CreateDefinitions<T extends RemoteDeclarations>(declarations: T, configuration?: DefinitionConfiguration): DefinitionsCreateResult<T>;
}
export = Net;
