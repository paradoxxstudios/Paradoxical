export class RaycastVisualizer {
    constructor(color?: Color3, worldRoot?: WorldRoot);
    Raycast(origin: Vector3, direction: Vector3, length: number, raycastParams?: RaycastParams): void;
}