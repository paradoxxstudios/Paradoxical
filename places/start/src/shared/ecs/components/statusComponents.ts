import { ComponentCtor } from "@rbxts/matter/lib/component";
import { Crouching, Running, LedgeHold, Dashing } from ".";

export const statusComponents = new Array<ComponentCtor>();
statusComponents.push(Crouching, Running, LedgeHold, Dashing);
