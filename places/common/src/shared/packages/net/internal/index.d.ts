/// <reference types="@rbxts/types" />
/// <reference types="@rbxts/compiler-types" />
export interface RequestCounter {
    Increment(player: Player): void;
    Get(player: Player): number;
}
export declare const IS_RUNNING: boolean;
export interface NetManagedInstance {
    GetInstance(): RemoteEvent | RemoteFunction;
}
/**
 * Errors with variables formatted in a message
 * @param message The message
 * @param vars variables to pass to the error message
 */
export declare function errorft(message: string, vars: {
    [name: string]: unknown;
}): never;
export declare function warnOnce(message: string): void;
export declare function format(message: string, vars: {
    [name: string]: unknown;
}): string;
export interface IAsyncListener {
    connection: RBXScriptConnection;
    timeout: number;
}
export declare type TypeGuard<T> = (value: unknown) => value is T;
export declare type TypeGuards<T> = T extends [
    TypeGuard<infer A>
] ? [
    TypeGuard<A>
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>
] ? [
    TypeGuard<A>,
    TypeGuard<B>
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>,
    TypeGuard<infer C>
] ? [
    A,
    B,
    C
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>,
    TypeGuard<infer C>,
    TypeGuard<infer D>
] ? [
    A,
    B,
    C,
    D
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>,
    TypeGuard<infer C>,
    TypeGuard<infer D>,
    TypeGuard<infer E>
] ? [
    A,
    B,
    C,
    D,
    E
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>,
    TypeGuard<infer C>,
    TypeGuard<infer D>,
    TypeGuard<infer E>,
    TypeGuard<infer F>
] ? [
    A,
    B,
    C,
    D,
    E,
    F
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>,
    TypeGuard<infer C>,
    TypeGuard<infer D>,
    TypeGuard<infer E>,
    TypeGuard<infer F>,
    TypeGuard<infer G>
] ? [
    A,
    B,
    C,
    D,
    E,
    F,
    G
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>,
    TypeGuard<infer C>,
    TypeGuard<infer D>,
    TypeGuard<infer E>,
    TypeGuard<infer F>,
    TypeGuard<infer G>,
    TypeGuard<infer H>
] ? [
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    H
] : Array<unknown>;
export declare type StaticArguments<T> = T extends [
    TypeGuard<infer A>
] ? [
    A
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>
] ? [
    A,
    B
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>,
    TypeGuard<infer C>
] ? [
    A,
    B,
    C
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>,
    TypeGuard<infer C>,
    TypeGuard<infer D>
] ? [
    A,
    B,
    C,
    D
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>,
    TypeGuard<infer C>,
    TypeGuard<infer D>,
    TypeGuard<infer E>
] ? [
    A,
    B,
    C,
    D,
    E
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>,
    TypeGuard<infer C>,
    TypeGuard<infer D>,
    TypeGuard<infer E>,
    TypeGuard<infer F>
] ? [
    A,
    B,
    C,
    D,
    E,
    F
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>,
    TypeGuard<infer C>,
    TypeGuard<infer D>,
    TypeGuard<infer E>,
    TypeGuard<infer F>,
    TypeGuard<infer G>
] ? [
    A,
    B,
    C,
    D,
    E,
    F,
    G
] : T extends [
    TypeGuard<infer A>,
    TypeGuard<infer B>,
    TypeGuard<infer C>,
    TypeGuard<infer D>,
    TypeGuard<infer E>,
    TypeGuard<infer F>,
    TypeGuard<infer G>,
    TypeGuard<infer H>
] ? [
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    H
] : Array<unknown>;
