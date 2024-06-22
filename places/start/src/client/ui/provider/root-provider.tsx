import { ReflexProvider } from "@rbxts/react-reflex";
import { RemProvider, RemProviderProps } from "./rem-provider";
import React from "@rbxts/react";
import { store } from "../../../shared/state/client";

interface RootProviderProps extends RemProviderProps {}

export function RootProvider({ baseRem, remOverride, children }: RootProviderProps) {
	return (
		<ReflexProvider producer={store}>
			<RemProvider baseRem={baseRem} remOverride={remOverride}>
				{children}
			</RemProvider>
		</ReflexProvider>
	);
}
