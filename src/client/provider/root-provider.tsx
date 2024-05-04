import { ReflexProvider } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { store } from "shared/state/client/store";

import { RemProvider, RemProviderProps } from "./rem-provider";

interface RootProviderProps extends RemProviderProps {}

export function RootProvider({ baseRem, remOverride, children }: RootProviderProps) {
	return (
		<ReflexProvider producer={store}>
			<RemProvider key="rem-provider" baseRem={baseRem} remOverride={remOverride}>
				{children}
			</RemProvider>
		</ReflexProvider>
	);
}
