/**
 * The Player component.
 *
 * Provides a reference to the {@link Player} that represents the attached
 * entity.
 */
export interface Players {
	player?: Player;
}

/**
 * The Model component.
 *
 * Provides a reference to the {@link PVInstance} that represents the attached
 * entity.
 */
export interface Model {
	model?: PVInstance;
	humanoid?: Humanoid;
	animator?: Animator;
}

/**
 * The Transform component.
 *
 * Provides a reference {@link CFrame} that represents the world transform of
 * the attached entity.
 */
export interface Transform {
	cframe: CFrame;
	_doNotReconcile?: true;
}

/**
 * The Health component.
 *
 * Provides health data, like current health, regenRate of the attached entity.
 */
export interface Health {
	current: number;
	max: number;
	regenAmount: number;
	regenRate: number;
	regenCD: number;
}
