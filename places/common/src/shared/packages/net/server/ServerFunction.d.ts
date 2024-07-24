/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
import { MiddlewareOverload } from "../middleware";
import MiddlewareFunction from "./MiddlewareFunction";
import { DefinitionConfiguration } from "../definitions";
export default class ServerFunction<CallbackArgs extends ReadonlyArray<unknown> = Array<unknown>, Returns extends unknown = unknown> extends MiddlewareFunction {
    private configuration;
    private instance;
    static readonly DefaultFunctionHook: () => undefined;
    constructor(name: string, middlewares: MiddlewareOverload<CallbackArgs> | undefined, configuration: DefinitionConfiguration);
    SetCallback<R extends Returns>(callback: (player: Player, ...args: CallbackArgs) => R): void;
}
