/// <reference types="@rbxts/types" />
declare global {
    interface MessagingService extends Instance {
        SubscribeAsync(name: string, callback: (data: ISubscriptionMessage) => void): RBXScriptConnection;
    }
}
export interface ISubscriptionMessage {
    Data: unknown;
    Sent: number;
}
interface IJobData {
    JobId: string;
    InnerData: unknown;
}
export interface ISubscriptionJobIdMessage extends ISubscriptionMessage {
    Data: IJobData;
}
/**
 * Checks if a value matches that of a subscription message
 * @param value The value
 */
export declare function isSubscriptionMessage(value: unknown): value is ISubscriptionMessage;
/**
 * An event that works across all servers
 * @see https://developer.roblox.com/api-reference/class/MessagingService for limits, etc.
 */
export default class ExperienceBroadcastEvent<TMessage extends unknown = unknown> {
    private name;
    constructor(name: string);
    /**
     * Gets the message limit
     */
    static GetMessageLimit(): number;
    /**
     * Gets the subscription limit
     */
    static GetSubscriptionLimit(): number;
    /**
     * Internal method for sending a message to all servers.
     *
     * @param data The data to send
     */
    private sendToAllServersOrQueue;
    /**
     * Sends a message to a specific server
     * @param serverJobId The game.JobId of the target server
     * @param sendData The message to send
     */
    SendToServer(serverJobId: string, sendData: TMessage): void;
    /**
     * Sends a message to all servers
     * @param sendData The message to send
     */
    SendToAllServers(sendData: TMessage): void;
    /**
     * Connects a function to a global event
     * @param handler The message handler
     */
    Connect(handler: (recievedData: TMessage, timestampSent: number) => void): RBXScriptConnection;
}
export {};
