import { ChickynoidServer } from "./chickynoidServer";
import PlayerRecord from "./playerRecord";

interface WeaponsServer {
	QueryBullet(
		playerRecord: PlayerRecord,
		server: typeof ChickynoidServer,
		origin: Vector3,
		dir: Vector3,
		serverTime: number,
		debugText: string,
		raycastParams: RaycastParams,
		range: number,
	): LuaTuple<
		[pos: Vector3, normal: Vector3, otherPlayerRecord: PlayerRecord | undefined, hitInstance: BasePart | Terrain]
	>;

	QueryShotgun(
		playerRecord: PlayerRecord,
		server: typeof ChickynoidServer,
		origins: Vector3[],
		directions: Vector3[],
		serverTime: number,
		debugText: string,
		raycastParams: RaycastParams,
		range: number,
	): Array<{
		pos: Vector3;
		normal: Vector3;
		hitInstance: BasePart | Terrain;
		otherPlayerRecord: PlayerRecord | undefined;
		origin: Vector3;
		dir: Vector3;
	}>;
}

interface WeaponsServerConstructor {
	/**
	 * Constructed internally. Do not use directly.
	 * @private
	 */
	new (): WeaponsServer;
}

declare const WeaponsServer: WeaponsServerConstructor;
export = WeaponsServer;
