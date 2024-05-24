import { ByteNetType, packet } from "@rbxts/bytenet";

declare function useBytenet<T>(
	id: string,
	packet: packet<ByteNetType<T>>,
): IterableFunction<LuaTuple<[id: number, data: T, player: Player | undefined]>>;

export = useBytenet;
