/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
import { NetMiddleware } from "../middleware";
export declare type MiddlewareList = ReadonlyArray<NetMiddleware<ReadonlyArray<unknown>>>;
declare abstract class MiddlewareEvent {
    private readonly middlewares;
    protected constructor(middlewares?: MiddlewareList);
    protected _processMiddleware<A extends ReadonlyArray<unknown>, R = void>(callback: (player: Player, ...args: A) => R): ((player: Player, ...args: A) => R) | undefined;
}
export default MiddlewareEvent;
