/// <reference types="@rbxts/types" />
/// <reference types="@rbxts/compiler-types" />
import { MiddlewareList } from "./MiddlewareEvent";
declare abstract class MiddlewareFunction {
    private readonly middlewares;
    protected constructor(middlewares?: MiddlewareList);
    abstract GetInstance(): RemoteFunction;
    protected _processMiddleware<A extends ReadonlyArray<unknown>, R = void>(callback: (player: Player, ...args: A) => R): ((player: Player, ...args: A) => R) | undefined;
}
export default MiddlewareFunction;
