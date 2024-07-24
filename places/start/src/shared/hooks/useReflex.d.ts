import { RootProducer as ClientRootProducer } from "shared/state/client";
import { SharedState } from "shared/state/shared/slices";
import type { RootProducer as ServerRootProducer } from "server/store";

declare function useReflex<T>(
	id: string,
	producer: ClientRootProducer | ServerRootProducer,
	selector: (state: SharedState) => T,
): IterableFunction<LuaTuple<[id: number, current: T, previous: T]>>;

export = useReflex;
