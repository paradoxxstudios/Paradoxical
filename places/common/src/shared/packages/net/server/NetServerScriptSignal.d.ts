/// <reference types="@rbxts/types" />
/// <reference types="@rbxts/compiler-types" />
export interface NetServerSignalConnection {
    Connected: boolean;
    Disconnect(this: NetServerSignalConnection): void;
}
/**
 * A wrapper around a RBXScriptSignal for remotes, that always has a listener set.
 */
export declare class NetServerScriptSignal<T extends (player: Player, ...args: unknown[]) => void, I extends RemoteEvent | RemoteFunction> {
    private signalInstance;
    private instance;
    private connections;
    private defaultConnection?;
    private connectionRefs;
    private defaultConnectionDelegate;
    constructor(signalInstance: RBXScriptSignal<T>, instance: I);
    /**
     * Establishes a function to be called whenever the event is raised. Returns a RBXScriptConnection object associated with the connection.
     * @param callback — The function to be called whenever the event is fired.
     */
    Connect(callback: T): NetServerSignalConnection;
    Wait(): LuaTuple<Parameters<T>>;
    WaitAsync(): Promise<LuaTuple<Parameters<T>>>;
    /**
     * Gets the current count of connections to this signal
     * @returns
     */
    GetCount(): number;
    DisconnectAll(): void;
}
