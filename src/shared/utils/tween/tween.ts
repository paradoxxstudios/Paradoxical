import { TweenService } from "@rbxts/services";

export function tween(
	instance: Instance,
	properties: { [index: string]: unknown },
	time?: number,
	easingStyle?: Enum.EasingStyle,
	easingDirection?: Enum.EasingDirection,
	repeatCount?: number,
	reverse?: boolean,
	delayTime?: number,
): Tween {
	time = time === undefined ? 1 : time;
	easingStyle = easingStyle === undefined ? Enum.EasingStyle.Quad : easingStyle;
	easingDirection = easingDirection === undefined ? Enum.EasingDirection.Out : easingDirection;
	repeatCount = repeatCount === undefined ? 0 : repeatCount;
	reverse = reverse === undefined ? false : reverse;
	delayTime = delayTime === undefined ? 0 : delayTime;

	const info = new TweenInfo(time, easingStyle, easingDirection, repeatCount, reverse, delayTime);
	const tween = TweenService.Create(instance, info, properties);
	tween.Play();

	return tween;
}
