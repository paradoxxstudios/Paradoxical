/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
import { NetManagedInstance } from "../internal";
import MiddlewareEvent from "./MiddlewareEvent";
import { MiddlewareOverload } from "../middleware";
import { NetServerSignalConnection } from "./NetServerScriptSignal";
import { DefinitionConfiguration } from "../definitions";
/**
 * Interface for server listening events
 */
export interface ServerListenerEvent<CallArguments extends ReadonlyArray<unknown>> {
    /**
     * Connects a callback function to this event, in which if any events are recieved by the client will be called.
     * @param callback The callback function
     */
    Connect(callback: (player: Player, ...args: CallArguments) => void): Readonly<NetServerSignalConnection>;
}
/**
 * Interface for server sender events
 */
export interface ServerSenderEvent<CallArguments extends ReadonlyArray<unknown>> {
    /**
     * Sends an event to all players on the server
     * @param args The arguments to send to the players
     */
    SendToAllPlayers(...args: CallArguments): void;
    /**
     * Sends an event to all players on the server except the specified player
     * @param blacklist The blacklist
     * @param args The arguments
     */
    SendToAllPlayersExcept(blacklist: Player | Array<Player>, ...args: CallArguments): void;
    /**
     * Sends an event to the specified player
     * @param player The player
     * @param args The arguments to send to the player
     */
    SendToPlayer(player: Player, ...args: CallArguments): void;
    /**
     * Sends an event to the specified players on the server
     * @param players The players
     * @param args The arugments to send to these players
     */
    SendToPlayers(players: Array<Player>, ...args: CallArguments): void;
}
export default class ServerEvent<ConnectArgs extends ReadonlyArray<unknown> = Array<unknown>, CallArgs extends ReadonlyArray<unknown> = Array<unknown>> extends MiddlewareEvent implements NetManagedInstance, ServerListenerEvent<ConnectArgs>, ServerSenderEvent<CallArgs> {
    private configuration;
    private instance;
    private connection;
    constructor(name: string, middlewares: MiddlewareOverload<ConnectArgs> | undefined, configuration: DefinitionConfiguration);
    /** @deprecated */
    GetInstance(): RemoteEvent<Callback>;
    /**
     * Connect a fucntion to fire when the event is invoked by the client
     * @param callback The function fired when the event is invoked by the client
     */
    Connect(callback: (player: Player, ...args: ConnectArgs) => void): Readonly<NetServerSignalConnection>;
    /**
     * Sends the specified arguments to all players
     * @param args The arguments to send to the players
     */
    SendToAllPlayers(...args: CallArgs): void;
    /**
     * Will send this message to all players except specified players
     * @param blacklist The blacklist
     * @param args The arguments
     */
    SendToAllPlayersExcept(blacklist: Player | Array<Player>, ...args: CallArgs): void;
    /**
     * Sends the specified arguments to a specified player
     * @param player The player
     * @param args The arguments to send to the player
     */
    SendToPlayer(player: Player, ...args: CallArgs): void;
    /**
     * Sends the specified argumetns to the specified list of players
     * @param players The players
     * @param args The arugments to send to these players
     */
    SendToPlayers(players: Array<Player>, ...args: CallArgs): void;
}
