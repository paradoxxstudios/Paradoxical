/// <reference types="@rbxts/compiler-types" />
import { DefinitionConfiguration } from ".";
import { ClientDefinitionBuilder } from "./ClientDefinitionBuilder";
import { ServerDefinitionBuilder } from "./ServerDefinitionBuilder";
import { NamespaceDeclaration, RemoteDeclarations } from "./Types";
export declare type ToServerBuilder<T> = T extends NamespaceBuilder<infer A> ? ServerDefinitionBuilder<A> : never;
export declare type ToClientBuilder<T> = T extends NamespaceBuilder<infer A> ? ClientDefinitionBuilder<A> : never;
export declare type InferDefinition<T> = T extends NamespaceDeclaration<infer R> ? R : never;
export interface NamespaceConfiguration extends Omit<DefinitionConfiguration, "ServerGlobalMiddleware" | "ClientGetShouldYield"> {
}
/**
 * A namespace builder. Internally used to construct definition builders
 */
export declare class NamespaceBuilder<N extends RemoteDeclarations> {
    private config?;
    constructor(declarations: N, config?: NamespaceConfiguration | undefined);
}
