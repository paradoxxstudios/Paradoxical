/// <reference types="@rbxts/compiler-types" />
/// <reference types="@rbxts/types" />
import { ISubscriptionMessage } from "../messaging/ExperienceBroadcastEvent";
import { DefinitionConfiguration } from "../definitions";
export interface IMessage<TArgs> {
    InnerData: TArgs;
    TargetId?: number;
    TargetIds?: Array<number>;
}
export interface ISubscriptionTargetedMessage extends ISubscriptionMessage {
    Data: IMessage<any>;
}
/**
 * Similar to a ServerEvent, but works across all servers.
 */
export default class ServerMessagingEvent<TArgs extends readonly unknown[] = unknown[]> {
    private readonly instance;
    private readonly event;
    private readonly eventHandler;
    constructor(name: string, config: DefinitionConfiguration);
    private getPlayersMatchingId;
    private recievedMessage;
    /**
     * Connects to the event on the server
     * @returns
     */
    Connect(serverListener: (receivedData: IMessage<TArgs>, timestampSent: number) => void): RBXScriptConnection;
    /**
     * SEnds an event to all servers in the game
     * @param args The args of the message
     */
    SendToAllServers(...args: TArgs): void;
    /**
     * Sends an event to the specified server
     * @param jobId The game.JobId of the target server
     * @param args The args of the message
     */
    SendToServer(jobId: string, ...args: TArgs): void;
    /**
     * Sends an event to the specified player (if they're in any of the game's servers)
     * @param userId The userId of the target player
     * @param args The args
     */
    SendToUserId(userId: number, ...args: TArgs): void;
    /**
     * Sends an event to all the specified players (if they're in any of the game's servers)
     * @param userIds The list of user ids to send this message to
     * @param args The args of the message
     */
    SendToUserIds(userIds: Array<number>, ...args: TArgs): void;
}
