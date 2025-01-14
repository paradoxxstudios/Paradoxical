import { useRem } from "client/ui/hooks/use-rem";
import { fonts } from "client/ui/utils/fonts";
import { palette } from "client/ui/utils/palette";

import { Button } from "./button";
import { useState } from "@rbxts/react";
import React from "@rbxts/react";

const COLORS = [palette.purple, palette.blue, palette.green, palette.yellow, palette.red];

export function Counter() {
	const rem = useRem();
	const [count, setCount] = useState(0);
	const [colorIndex, setColorIndex] = useState(0);

	return (
		<Button
			onClick={() => {
				setCount(count + 1);
				setColorIndex((colorIndex + 1) % COLORS.size());
			}}
			font={fonts.inter.medium}
			text={`👆 Clicked ${count} times`}
			textSize={rem(2)}
			textColor={palette.white}
			backgroundColor={COLORS[colorIndex]}
			size={new UDim2(0, rem(20), 0, rem(8))}
			position={new UDim2(0.5, 0, 0.5, 0)}
			anchorPoint={new Vector2(0.5, 0.5)}
		/>
	);
}
