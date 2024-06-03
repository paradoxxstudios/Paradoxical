import { World, useDeltaTime } from "@rbxts/matter";
import { useMap } from "@rbxts/matter-hooks";
import { playerId } from "shared/constants";
import { Model } from "shared/ecs/components";

const MOMENTUM_FACTOR = 0.008;
const SPEED = 16;

function leaning(world: World) {
	if (!world.contains(tonumber(playerId) as number)) return;

	const model = world.get(tonumber(playerId) as number, Model);
	const humanoid = model?.humanoid as Humanoid;
	const humanoidRootPart = model?.humanoidRootPart as BasePart;

	const rootJoint = humanoidRootPart.FindFirstChild("RootJoint") as Motor6D;
	if (rootJoint === undefined) return;
	const originalC0 = useMap("c0", rootJoint.C0);

	const direction = humanoidRootPart.CFrame.VectorToObjectSpace(humanoid.MoveDirection);
	let momentum = humanoidRootPart.CFrame.VectorToObjectSpace(humanoidRootPart.AssemblyLinearVelocity).mul(
		MOMENTUM_FACTOR,
	);
	momentum = new Vector3(
		math.clamp(math.abs(momentum.X), 0, math.huge),
		0,
		math.clamp(math.abs(momentum.Z), 0, math.huge),
	);

	const x = direction.X * momentum.X;
	const z = direction.Z * momentum.Z;

	rootJoint.C0 = rootJoint.C0.Lerp(originalC0.value.mul(CFrame.Angles(-z, -x, 0)), useDeltaTime() * SPEED);
}

export = leaning;
