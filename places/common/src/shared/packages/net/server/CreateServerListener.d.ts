/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
import { NetMiddleware } from "../middleware";
/**
 * Creates a server listening event
 */
export default function createServerListener<T extends Array<unknown>>(id: string, callback: (player: Player, ...args: T) => void): RBXScriptConnection;
export default function createServerListener<M0 extends Array<unknown>>(id: string, middleware: [
    NetMiddleware<M0>
], callback: (player: Player, ...args: M0) => void): RBXScriptConnection;
export default function createServerListener<M0 extends Array<unknown>, M1 extends Array<unknown>>(id: string, middleware: [
    NetMiddleware<M0>,
    NetMiddleware<M1, M0>
], callback: (player: Player, ...args: M1) => void): RBXScriptConnection;
export default function createServerListener<M0 extends Array<unknown>, M1 extends Array<unknown>, M2 extends Array<unknown>>(id: string, middleware: [
    NetMiddleware<M0>,
    NetMiddleware<M1, M0>,
    NetMiddleware<M2, M1>
], callback: (player: Player, ...args: M2) => void): RBXScriptConnection;
