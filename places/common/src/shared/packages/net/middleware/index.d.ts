/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
import { NetManagedInstance } from "../internal";
import createRateLimiter from "./RateLimitMiddleware";
export declare type NextCaller<R = void> = (player: defined, ...args: ReadonlyArray<unknown>) => R;
export declare type MiddlewareOverload<T extends readonly unknown[]> = [
] | [
    NetMiddleware<T>
] | [
    NetMiddleware,
    NetMiddleware<T>
] | [
    NetMiddleware,
    NetMiddleware,
    NetMiddleware<T>
] | [
    NetMiddleware,
    NetMiddleware,
    NetMiddleware,
    NetMiddleware<T>
] | [
    NetMiddleware,
    NetMiddleware,
    NetMiddleware,
    NetMiddleware,
    NetMiddleware<T>
] | [
    NetMiddleware,
    NetMiddleware,
    NetMiddleware,
    NetMiddleware,
    NetMiddleware,
    NetMiddleware<T>
];
export declare type NetMiddleware<CallArguments extends ReadonlyArray<unknown> = Array<unknown>, PreviousCallArguments extends ReadonlyArray<unknown> = Array<unknown>> = (next: (player: Player, ...args: CallArguments) => void, event: NetManagedInstance) => (sender: Player, ...args: PreviousCallArguments) => void;
export declare type NetGlobalMiddleware = (next: (player: Readonly<Player>, ...args: readonly unknown[]) => void, event: Readonly<NetManagedInstance>) => (sender: Readonly<Player>, ...args: readonly unknown[]) => void;
export interface ReadonlyGlobalMiddlewareArgs {
    (remoteName: string, remoteData: readonly unknown[], callingPlayer?: Player): void;
}
export declare namespace NetMiddleware {
    const RateLimit: typeof createRateLimiter;
    const Logging: (options?: import("./LoggerMiddleware/types").LoggingOptions | undefined) => NetMiddleware<unknown[], unknown[]>;
    /** The type checking middleware */
    const TypeChecking: import("./TypeCheckMiddleware/types").TypeChecking;
    /**
     * Creates a global read-only middleware for use in `Net.Definitions` global middleware.
     */
    function Global(middleware: ReadonlyGlobalMiddlewareArgs): NetGlobalMiddleware;
}
declare const createTypeChecker: import("./TypeCheckMiddleware/types").TypeChecking;
export { createRateLimiter, createTypeChecker };
