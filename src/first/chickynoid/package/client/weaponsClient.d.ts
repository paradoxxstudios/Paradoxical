import Signal from "@rbxts/signal";
import { ChickynoidClient } from "./chickynoidClient";
import { WeaponModule } from "../shared/weaponsModule";

/** @client */
export namespace WeaponsClient {
	export let OnBulletImpact: Signal<(client: typeof ChickynoidClient, event: unknown) => void>;

	export function GetWeaponModuleByWeaponId(self: typeof WeaponsClient, weaponId: number): WeaponModule;
}
