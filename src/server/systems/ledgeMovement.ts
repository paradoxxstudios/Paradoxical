import { World, useThrottle } from "@rbxts/matter";
import { Players, Workspace } from "@rbxts/services";
import { RootProducer } from "server/store";
import { idleAnimationIds, movementAnimationIds, walkAnimationIds } from "shared/assets/animation";
import { LedgeHold, Model, Player, Running } from "shared/ecs/components";
import { StateType } from "shared/ecs/types";
import useReflex from "shared/hooks/useReflex";
import { ledgeMovement as ledgeMovementNet } from "shared/net";
import { selectPlayerLedgeInfo } from "shared/state/shared/selectors/players/ledgeInfo";
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

function ledgeMovement(world: World, state: StateType) {
	const reflexState = state.reflex as RootProducer;

	for (const [id, model, player] of world.query(Model, Player)) {
		for (const [_, current, previous] of useReflex(
			player.stringId as string,
			reflexState,
			selectPlayerLedgeInfo(player.stringId as string),
		)) {
			const humanoid = model.humanoid as Humanoid;
			const humanoidRootPart = model.humanoidRootPart as BasePart;
			const head = model.bodyParts?.head as BasePart;

			if (current && previous && current.jumped !== previous.jumped) {
				if (
					current.canVault &&
					(humanoid.GetState() === Enum.HumanoidStateType.Freefall ||
						humanoid.GetState() === Enum.HumanoidStateType.Jumping)
				) {
					const ledgeCheck = Workspace.Raycast(
						humanoidRootPart.CFrame.Position,
						humanoidRootPart.CFrame.LookVector.mul(5),
						current.raycastParams,
					);
					if (!ledgeCheck || !ledgeCheck.Instance) continue;

					const constPos = ledgeCheck.Instance.CFrame.PointToObjectSpace(ledgeCheck.Position);
					const constLedgePos = new Vector3(constPos.X, ledgeCheck.Instance.Size.Y / 2, constPos.Z);
					const ledgePos = ledgeCheck.Instance.CFrame.PointToWorldSpace(constLedgePos);
					const ledgeOffset = CFrame.lookAt(ledgePos, ledgePos.sub(ledgeCheck.Normal));

					const magnitude = ledgePos.sub(head.Position).Magnitude;
					if (magnitude >= 4 || !partCheck(ledgeOffset, current.raycastParams as RaycastParams)) continue;
					if (!useThrottle(0.5)) continue;

					world.remove(id, Running);
					reflexState.changeCanVault(player.stringId as string, false);

					const ledgePart = new Instance("Part");
					ledgePart.Parent = Workspace;
					ledgePart.Anchored = true;
					ledgePart.Size = Vector3.one;
					ledgePart.CFrame = ledgeOffset.add(new Vector3(0, -2, 0)).add(ledgeOffset.LookVector.mul(-1));
					ledgePart.CanQuery = false;
					ledgePart.CanCollide = false;
					ledgePart.CanTouch = false;
					ledgePart.Transparency = 1;

					reflexState.changeAnimationId(tostring(id), "land", idleAnimationIds.ledge);
					reflexState.changeAnimationId(tostring(id), "walk", idleAnimationIds.ledge);
					reflexState.changeAnimationId(tostring(id), "idle", idleAnimationIds.ledge);

					world.insert(id, LedgeHold({ part: ledgePart }));
				} else if (!current.canVault) {
					reflexState.changeCanVault(player.stringId as string, true);
					humanoid.AutoRotate = true;
					humanoidRootPart.Anchored = false;
					ledgeMovementNet.jump.sendTo(undefined, Players.GetPlayerByUserId(id) as Player);
					reflexState.changeAnimationId(tostring(id), "idle", idleAnimationIds.idle);
					reflexState.changeAnimationId(tostring(id), "walk", walkAnimationIds.walk);
					reflexState.changeAnimationId(tostring(id), "land", movementAnimationIds.land);

					const ledgePart = world.get(id, LedgeHold)?.part as BasePart;
					ledgePart.Destroy();
					world.remove(id, LedgeHold);
				}
			}
		}
	}

	for (const [id, ledgeHold, model] of world.query(LedgeHold, Model)) {
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
		ledgeMovementNet.grab.sendTo(undefined, player);

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

export = ledgeMovement;
