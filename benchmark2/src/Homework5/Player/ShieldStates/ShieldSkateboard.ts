import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW5_Color } from "../../hw5_color";
import { ShieldStates } from "../ShieldController";
import ShieldState from "./ShieldState";

export default class ShieldSkateboard extends ShieldState {
	owner: AnimatedSprite;
    onEnter(options: Record<string, any>): void {

        if(options !== undefined && options.player !== undefined){
			this.player = options.player;
		}


		//The shield and the player CAN'T collide
		this.owner.isCollidable=false;
	}


	update(deltaT: number): void {
        super.update(deltaT);
        //this.owner.animation.playIfNotAlready("IDLE", true);
        if(!Input.isPressed("skate")){
            this.finished(ShieldStates.IDLE);
        }

        if(this.player !== undefined && this.player.position !== undefined){
            // put shield below the player if not already

            let x = this.player.position.x+64;
            let y = this.player.position.y-64;
            if (this.owner.position.x === x && this.owner.position.y === y) {
                return;
            }
            this.owner.position = new Vec2(x, y);
        }
	}

	onExit(): Record<string, any> {
		return {};
	}
}