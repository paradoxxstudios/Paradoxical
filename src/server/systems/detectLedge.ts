import { World, useThrottle } from "@rbxts/matter";
import { Players, Workspace } from "@rbxts/services";
import { RootProducer } from "server/store";
import { walkAnimationIds } from "shared/assets/animation";
import { Model, LedgeHold } from "shared/ecs/components";
import { StateType } from "shared/ecs/types";
import { ledgeMovement } from "shared/net";
import { tween } from "shared/utils/tween/tween";

function partCheck(ledge: CFrame, raycastPrams: RaycastParams): boolean {
	const ledgeCheck = Workspace.Raycast(
		ledge.Position.add(new Vector3(0, -1, 0)).add(ledge.LookVector),
		ledge.UpVector.mul(3),
		raycastPrams,
	);
	return ledgeCheck === undefined;
}

function ledgeMoveCheck(
	player: string,
	reflexState: RootProducer,
	ray: RaycastResult,
	head: BasePart,
	ledgePart: BasePart,
	direction: string,
	raycastPrams: RaycastParams,
) {
	const localPosition = ray.Instance.CFrame.PointToObjectSpace(ray.Position);
	const localLedgePosition = new Vector3(localPosition.X, ray.Instance.Size.Y / 2, localPosition.Z);
	const ledgePosition = ray.Instance.CFrame.PointToWorldSpace(localLedgePosition);
	const ledgeOffset = CFrame.lookAt(ledgePosition, ledgePosition.sub(ray.Normal));

	if (partCheck(ledgeOffset, raycastPrams)) {
		const magnitude = ledgePosition.sub(head.Position).Magnitude;
		if (magnitude < 3) {
			const goal = { CFrame: ledgeOffset.add(new Vector3(0, -2, 0)).add(ledgeOffset.LookVector.mul(-1)) };
			tween(ledgePart, goal, 0.15, Enum.EasingStyle.Sine, Enum.EasingDirection.Out);

			if (direction === "right") {
				reflexState.changeAnimationId(player, "walk", walkAnimationIds.ledge.right);
			} else if (direction === "left") {
				reflexState.changeAnimationId(player, "walk", walkAnimationIds.ledge.left);
			}
		}
	}
}

function ledgeMove(
	player: string,
	reflexState: RootProducer,
	direction: number,
	head: BasePart,
	ledgePart: BasePart,
	anim: string,
	raycastPrams: RaycastParams,
) {
	const moveRay = Workspace.Raycast(
		head.CFrame.Position,
		head.CFrame.RightVector.mul(direction).add(head.CFrame.LookVector.mul(8)),
		raycastPrams,
	);

	if (moveRay) {
		if (moveRay.Instance === undefined) return;
		ledgeMoveCheck(player, reflexState, moveRay, head, ledgePart, anim, raycastPrams);
	} else {
		const turnRay = Workspace.Raycast(
			head.CFrame.Position.add(new Vector3(0, -1, 0)).add(head.CFrame.RightVector.mul(direction)),
			head.CFrame.RightVector.mul(-direction).add(head.CFrame.LookVector.mul(2)),
			raycastPrams,
		);
		if (!turnRay || !turnRay.Instance) return;
		ledgeMoveCheck(player, reflexState, turnRay, head, ledgePart, anim, raycastPrams);
	}
}

function detectLedge(world: World, state: StateType) {
	const reflexState = state.reflex as RootProducer;

	for (const [id, model, ledgeHold] of world.query(Model, LedgeHold)) {
		const ledgeInfo = reflexState.getState().players.ledgeInfo[id + ""];
		if (!ledgeInfo) continue;

		const humanoid = model.humanoid as Humanoid;
		const humanoidRootPart = model.humanoidRootPart as BasePart;

		const ledgePart = ledgeHold.part as BasePart;

		humanoidRootPart.Anchored = true;
		humanoid.AutoRotate = false;
		humanoidRootPart.CFrame = humanoidRootPart.CFrame.Lerp(
			CFrame.lookAt(ledgePart.Position, ledgePart.CFrame.mul(new CFrame(0, 0, -1)).Position),
			0.25,
		);
		const player = Players.GetPlayerByUserId(id);
		if (player === undefined) continue;
		ledgeMovement.grab.sendTo(undefined, player);

		if (ledgeInfo.moveDirection === undefined) continue;
		if (ledgeInfo.canVault || !useThrottle(0.35)) continue;
		if (ledgeInfo.moveDirection > 0.7) {
			ledgeMove(
				tostring(tostring(id)),
				reflexState,
				ledgeInfo.ledgeMoveAmount,
				model.bodyParts?.head as BasePart,
				ledgePart,
				"right",
				ledgeInfo.raycastParams as RaycastParams,
			);
		}

		if (ledgeInfo.moveDirection < -0.7) {
			ledgeMove(
				tostring(id),
				reflexState,
				-ledgeInfo.ledgeMoveAmount,
				model.bodyParts?.head as BasePart,
				ledgePart,
				"left",
				ledgeInfo.raycastParams as RaycastParams,
			);
		}
	}
}

export = detectLedge;
