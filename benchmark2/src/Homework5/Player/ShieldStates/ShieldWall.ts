import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW5_Color } from "../../hw5_color";
import { ShieldStates } from "../ShieldController";
import ShieldState from "./ShieldState";

export default class ShieldWall extends ShieldState {
	owner: AnimatedSprite;
    onEnter(options: Record<string, any>): void {
		//The shield and the player CAN collide
		this.owner.isCollidable=true;

		//Currently, physics are enabled between the shield and the player
		//Hence, the player and the shield will collide.
		// If we wanted to do another shield move that doesn't involve
		// reflection OR the player interacting with it, disable the physics
		// using this command:
		//		this.owner.disablePhysics();
		//If we still need the reflection, but we don't want the player->shield
		// collision, use this command:
		//		this.owner.isCollidable = false;
	}


	update(deltaT: number): void {
		this.owner.animation.playIfNotAlready("IDLE", true);
	}

	onExit(): Record<string, any> {
		return {};
	}
}