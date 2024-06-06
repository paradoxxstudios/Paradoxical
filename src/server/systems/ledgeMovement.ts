import { World, useThrottle } from "@rbxts/matter";
import { Players, Workspace } from "@rbxts/services";
import { RootProducer } from "server/store";
import { idleAnimationIds, movementAnimationIds, walkAnimationIds } from "shared/assets/animation";
import { LedgeHold, Model, Player, Running } from "shared/ecs/components";
import { StateType } from "shared/ecs/types";
import useReflex from "shared/hooks/useReflex";
import { ledgeMovement as ledgeMovementNet } from "shared/net";
import { selectPlayerLedgeInfo } from "shared/state/shared/selectors/players/ledgeInfo";

function partCheck(ledge: CFrame, raycastPrams: RaycastParams): boolean {
	const ledgeCheck = Workspace.Raycast(
		ledge.Position.add(new Vector3(0, -1, 0)).add(ledge.LookVector),
		ledge.UpVector.mul(3),
		raycastPrams,
	);
	return ledgeCheck === undefined;
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
}

export = ledgeMovement;
