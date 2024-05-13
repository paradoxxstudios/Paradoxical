import { RootProducer } from "shared/state/client";
import { SharedState } from "shared/state/shared/slices";

declare function useReflex<T>(
	id: string,
	producer: RootProducer,
	selector: (state: SharedState) => T,
): IterableFunction<LuaTuple<[id: number, current: T, previous: T]>>;

export = useReflex;