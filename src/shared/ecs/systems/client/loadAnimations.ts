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
import { StateType } from "shared/ecs/types";

function loadAnimation(name: AnimationKeys, id: number, animator: Animator, reflexState: RootProducer) {
	const animationIds = reflexState.getState().players.animationId[playerId] as PlayerAnimationIds;
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
	reflexState.setAnimation(playerId, name as AnimationKeys, track);
	animation.Destroy();

	return track;
}

function loadAnimations(world: World, state: StateType) {
	if (!world.contains(tonumber(playerId) as number)) return;

	const model = world.get(tonumber(playerId) as number, Model);
	const animator = model?.animator as Animator;
	if (animator === undefined) return;

	const reflexState = state.reflex as RootProducer;

	if (reflexState.getState().players.animationId[playerId] === undefined) return;
	if (reflexState.getState().players.animation[playerId]?.idle === undefined) {
		let idle;
		for (const [name, id] of pairs(reflexState.getState().players.animationId[playerId] as PlayerAnimationIds)) {
			const track = loadAnimation(name, id, animator, reflexState);
			if (name === "idle") idle = track;
		}
		reflexState.playAnimation(playerId, idle as AnimationTrack);
	}

	for (const [_, current, previous] of useReflex(playerId, reflexState, selectPlayerIdleId(playerId))) {
		if (current === undefined || current === previous) continue;
		loadAnimation("idle", current, animator, reflexState);
	}

	for (const [_, current, previous] of useReflex(playerId, reflexState, selectPlayerWalkId(playerId))) {
		if (current === undefined || current === previous) continue;
		loadAnimation("walk", current, animator, reflexState);
	}

	for (const [_, current, previous] of useReflex(playerId, reflexState, selectPlayerRunId(playerId))) {
		if (current === undefined || current === previous) continue;
		loadAnimation("run", current, animator, reflexState);
	}

	for (const [_, current, previous] of useReflex(playerId, reflexState, selectPlayerJumpId(playerId))) {
		if (current === undefined || current === previous) continue;
		loadAnimation("jump", current, animator, reflexState);
	}

	for (const [_, current, previous] of useReflex(playerId, reflexState, selectPlayerLandId(playerId))) {
		if (current === undefined || current === previous) continue;
		loadAnimation("land", current, animator, reflexState);
	}
}

export = {
	system: loadAnimations,
	after: [spawnAnimator],
};
