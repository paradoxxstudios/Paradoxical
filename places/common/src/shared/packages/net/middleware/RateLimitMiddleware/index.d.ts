/// <reference types="@rbxts/compiler-types" />
import { NetMiddleware } from "../../middleware";
declare type RateLimitMiddleware = NetMiddleware<any, Array<unknown>>;
export interface RateLimitError {
    Message: string;
    UserId: number;
    RemoteId: string;
    MaxRequestsPerMinute: number;
}
export interface RateLimitOptions {
    MaxRequestsPerMinute: number;
    /**
     * @default "Request limit exceeded ({limit}) by {player} via {remote}"
     */
    ThrottleMessage?: string;
    ErrorHandler?: (rateLimitError: RateLimitError) => void;
}
export declare function rateLimitWarningHandler(rateLimitError: RateLimitError): void;
/**
 * Creates a throttle middleware for this event
 *
 * Will limit the amount of requests a player can make to this event
 *
 * _NOTE: Must be used before **other** middlewares as it's not a type altering middleware_
 * @param maxRequestsPerMinute The maximum requests per minute
 */
declare function createRateLimiter(options: RateLimitOptions): RateLimitMiddleware;
export default createRateLimiter;
