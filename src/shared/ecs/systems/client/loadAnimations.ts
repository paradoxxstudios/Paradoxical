import { World } from "@rbxts/matter";
import { playerId } from "shared/constants";
import { Model } from "shared/ecs/components";
import useReflex from "shared/hooks/useReflex";
import { RootProducer } from "shared/state/client";
import {
	selectPlayerIdleId,
	selectPlayerJumpId,
	selectPlayerLandId,
	selectPlayerRunId,
	selectPlayerWalkId,
} from "shared/state/shared/selectors/players/animationId";
import spawnAnimator from "./spawnAnimator";
import { AnimationKeys, PlayerAnimationIds } from "shared/state/shared/slices/players";

function loadAnimation(name: AnimationKeys, id: number, animator: Animator, state: RootProducer) {
	const animationIds = state.getState().players.animationId[playerId] as PlayerAnimationIds;
	// eslint-disable-next-line roblox-ts/no-array-pairs
	for (const [_, track] of pairs(animator.GetPlayingAnimationTracks())) {
		if (animationIds[track.Name as AnimationKeys] !== undefined) {
			track.Stop();
		}
	}

	const animation = new Instance("Animation");
	animation.AnimationId = "rbxassetid://" + id;
	animation.Name = name;
	const track = animator.LoadAnimation(animation) as AnimationTrack;
	track.Priority = Enum.AnimationPriority.Core;
	state.setAnimation(playerId, name as AnimationKeys, track);
	animation.Destroy();

	return track;
}

function loadAnimations(world: World, state: RootProducer) {
	if (!world.contains(tonumber(playerId) as number)) return;

	const model = world.get(tonumber(playerId) as number, Model);
	const animator = model?.animator as Animator;
	if (animator === undefined) return;

	if (state.getState().players.animationId[playerId] === undefined) return;
	if (state.getState().players.animation[playerId]?.idle === undefined) {
		let idle;
		for (const [name, id] of pairs(state.getState().players.animationId[playerId] as PlayerAnimationIds)) {
			const track = loadAnimation(name, id, animator, state);
			if (name === "idle") idle = track;
		}
		state.playAnimation(playerId, idle as AnimationTrack);
	}

	for (const [_, current, previous] of useReflex(playerId, state, selectPlayerIdleId(playerId))) {
		if (current === undefined || current === previous) continue;
		const track = loadAnimation("idle", current, animator, state);
		state.playAnimation(playerId, track);
	}

	for (const [_, current, previous] of useReflex(playerId, state, selectPlayerWalkId(playerId))) {
		if (current === undefined || current === previous) continue;
		loadAnimation("walk", current, animator, state);
	}

	for (const [_, current, previous] of useReflex(playerId, state, selectPlayerRunId(playerId))) {
		if (current === undefined || current === previous) continue;
		loadAnimation("run", current, animator, state);
	}

	for (const [_, current, previous] of useReflex(playerId, state, selectPlayerJumpId(playerId))) {
		if (current === undefined || current === previous) continue;
		loadAnimation("jump", current, animator, state);
	}

	for (const [_, current, previous] of useReflex(playerId, state, selectPlayerLandId(playerId))) {
		if (current === undefined || current === previous) continue;
		loadAnimation("land", current, animator, state);
	}
}

export = {
	system: loadAnimations,
	after: [spawnAnimator],
};
