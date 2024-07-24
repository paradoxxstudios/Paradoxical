import { tween } from "../tween";

export function tweenFOV(
	camera: Camera,
	endValue: number,
	time?: number,
	easingStyle?: Enum.EasingStyle,
	easingDirection?: Enum.EasingDirection,
	repeatCount?: number,
	reverse?: boolean,
	delayTime?: number,
): Tween {
	return tween(
		camera,
		{ FieldOfView: endValue },
		time,
		easingStyle,
		easingDirection,
		repeatCount,
		reverse,
		delayTime,
	);
}
