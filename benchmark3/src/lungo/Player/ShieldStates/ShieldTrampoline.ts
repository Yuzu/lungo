import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Lungo_Color } from "../../Lungo_color";
import { ShieldStates } from "../ShieldController";
import ShieldState from "./ShieldState";

export default class ShieldTrampoline extends ShieldState {
	owner: AnimatedSprite;
    onEnter(options: Record<string, any>): void {
		//The shield and the player CANT collide
		this.owner.isCollidable=false;
	}


	update(deltaT: number): void {
		if (!this.owner.animation.isPlaying("REFLECT")) {
			this.owner.animation.playIfNotAlready("TRAMPOLINE", true);
		}
	}

	onExit(): Record<string, any> {
		return {};
	}
}