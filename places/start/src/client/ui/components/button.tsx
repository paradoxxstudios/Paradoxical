import { useMotion } from "client/ui/hooks/use-motion";
import { useRem } from "client/ui/hooks/use-rem";
import { brighten } from "client/ui/utils/colors";
import { fonts } from "client/ui/utils/fonts";
import { palette } from "client/ui/utils/palette";
import { springs } from "client/ui/utils/springs";
import { useEffect, useState } from "@rbxts/react";
import React from "@rbxts/react";

interface ButtonProps {
	onClick?: () => void;
	font?: Font;
	text?: string;
	textSize?: number;
	textColor?: Color3;
	backgroundColor?: Color3;
	size?: UDim2;
	position?: UDim2;
	anchorPoint?: Vector2;
	children?: React.ReactChild;
}

export function Button({
	onClick,
	font = fonts.inter.regular,
	text,
	textSize,
	textColor = palette.white,
	backgroundColor = palette.blue,
	size,
	position,
	anchorPoint,
	children,
}: ButtonProps) {
	const rem = useRem();
	const [pressed, setPressed] = useState(false);
	const [hovered, setHovered] = useState(false);
	const [buttonPosition, buttonPositionMotion] = useMotion(0);
	const [buttonColor, buttonColorMotion] = useMotion(backgroundColor);

	useEffect(() => {
		if (pressed) {
			buttonPositionMotion.spring(rem(0.5), springs.responsive);
			buttonColorMotion.spring(brighten(backgroundColor, -0.1), springs.responsive);
		} else if (hovered) {
			buttonPositionMotion.spring(rem(-0.5), springs.responsive);
			buttonColorMotion.spring(brighten(backgroundColor, 0.1), springs.responsive);
		} else {
			buttonPositionMotion.spring(0, springs.responsive);
			buttonColorMotion.spring(backgroundColor, springs.responsive);
		}
	}, [pressed, hovered, backgroundColor, rem]);

	useEffect(() => {
		if (!pressed && hovered) {
			buttonPositionMotion.impulse(rem(-0.05));
			buttonPositionMotion.spring(rem(-0.5), springs.bubbly);
		}
	}, [pressed]);

	return (
		<frame BackgroundTransparency={1} AnchorPoint={anchorPoint} Size={size} Position={position}>
			<textbutton
				key="button"
				FontFace={font}
				Text={text}
				TextColor3={textColor}
				TextSize={textSize}
				AutoButtonColor={false}
				BackgroundColor3={buttonColor}
				Size={new UDim2(1, 0, 1, 0)}
				Position={buttonPosition.map((y) => new UDim2(0, 0, 0, y))}
				Event={{
					Activated: onClick,
					MouseEnter: () => setHovered(true),
					MouseLeave: () => {
						setHovered(false);
						setPressed(false);
					},
					MouseButton1Down: () => setPressed(true),
					MouseButton1Up: () => setPressed(false),
				}}
			>
				<uicorner key="button-corner" CornerRadius={new UDim(0, rem(1))} />
				{children}
			</textbutton>
		</frame>
	);
}
