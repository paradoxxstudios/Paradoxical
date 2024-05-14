import { Players, ReplicatedStorage, RunService } from "@rbxts/services";
import { playerId } from "shared/constants";
import { store } from "shared/state/client";
import { selectPlayerAnimationIds } from "shared/state/shared/selectors";
import { AnimationKeys, PlayerAnimations } from "shared/state/shared/slices/players";

const player = Players.LocalPlayer;
const character = player.Character || player.CharacterAdded.Wait()[0];
const humanoid = character.WaitForChild("Humanoid") as Humanoid;
const animator = humanoid.WaitForChild("Animator") as Animator;

const animationFolder = ReplicatedStorage.WaitForChild("assets")?.WaitForChild("animations");
const animations = new Map<AnimationKeys, Animation>([
	["idle", animationFolder?.FindFirstChild("idle")?.FindFirstChild("idle") as Animation],
	["walk", animationFolder?.FindFirstChild("walk")?.FindFirstChild("walk") as Animation],
	["run", animationFolder?.FindFirstChild("movement")?.FindFirstChild("run") as Animation],
	["jump", animationFolder?.FindFirstChild("movement")?.FindFirstChild("jump") as Animation],
	["land", animationFolder?.FindFirstChild("movement")?.FindFirstChild("land") as Animation],
]);

let animationState = store.getState().players.animation[playerId] as PlayerAnimations;

function loadAnimations(/*animationIds: Map<string, number>*/) {
	for (const [name, animation] of animations) {
		const track = animator.LoadAnimation(animation) as AnimationTrack;
		track.Priority = Enum.AnimationPriority.Core;
		store.setAnimation(playerId, name, track);
	}

	animationState = store.getState().players.animation[playerId] as PlayerAnimations;
}

while (store.getState().players.animation[playerId] === undefined) task.wait();

print(store.getState().players.animation[playerId]?.animationIds);
store.subscribe(selectPlayerAnimationIds(playerId), (animationIds) => {
	// if (animationIds) loadAnimations(animationIds);
});

loadAnimations();

humanoid.StateChanged.Connect((_, newState) => {
	switch (newState) {
		case Enum.HumanoidStateType.Jumping: {
			store.playAnimation(playerId, animationState.jump as AnimationTrack);
			store.changeJumpAnimTime(playerId, 0.35);
			break;
		}
		case Enum.HumanoidStateType.Freefall: {
			store.toggleFreefall(playerId);
			break;
		}
	}
});

function animate(dt: number) {
	store.changeJumpAnimTime(playerId, (store.getState().players.animation[playerId]?.jumpAnimTime as number) - dt);

	if (
		store.getState().players.animation[playerId]?.freefalling &&
		store.getState().players.animation[playerId]?.jumpAnimTime === 0
	) {
		store.toggleFreefall(playerId);
		store.playAnimation(playerId, animationState.land as AnimationTrack);
	}

	if (animationState.jump?.IsPlaying || animationState.land?.IsPlaying) return;
	if (humanoid.MoveDirection.Magnitude !== 0) {
		store.playAnimation(playerId, animationState.walk as AnimationTrack);
	} else {
		store.playAnimation(playerId, animationState.idle as AnimationTrack);
	}
}

RunService.Heartbeat.Connect(animate);
