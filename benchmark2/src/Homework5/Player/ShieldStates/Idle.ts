import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW5_Color } from "../../hw5_color";
import { ShieldStates } from "../ShieldController";
import ShieldState from "./ShieldState";

export default class Idle extends ShieldState {
	owner: AnimatedSprite;
	player: GameNode;
	onEnter(options: Record<string, any>): void {
		this.player = options.player;
	}


	update(deltaT: number): void {
		let mousePosition = Input.getGlobalMousePosition();
        if(this.player !== undefined && this.player.position !== undefined){
            let angleRadians = Math.atan2(mousePosition.y - this.player.position.y, mousePosition.x - this.player.position.x);
            let r = 50;
            let x = r*Math.cos(angleRadians) + this.player.position.x;
            let y = r*Math.sin(angleRadians) + this.player.position.y;
            this.owner.position = new Vec2(x, y);
        }
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}