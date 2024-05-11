/* eslint-disable prettier/prettier */
type ZapEvent<T, U> = { on: (callback: (sender: T | undefined, data: U | undefined) => void) => () => void };

declare function useZap<T, U>(
    zapEvent: ZapEvent<T, U>
): IterableFunction<LuaTuple<[id: number, sender: T, data: U]>>;

export = useZap;
