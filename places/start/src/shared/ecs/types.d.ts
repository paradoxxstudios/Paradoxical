import { CombineProducers } from "@rbxts/reflex";
import { SparkState } from "shared/spark";

export type StateType = { reflex: CombineProducers<{}>; spark: SparkState };
