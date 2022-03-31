import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { HW5_Events } from "../hw5_enums";
import BalloonState from "./BalloonState";
import { BalloonStates } from "./BalloonController";
import { HW5_Color } from "../hw5_color";

// HOMEWORK 5 - TODO
/**
 * For this homework, you'll have to implement an additional state to the AI from scratch.
 * 
 * This new behavior should be for the zero gravity balloon state, where the balloon no
 * longer has gravity affecting it.
 * 
 * Along with this, the balloon should move twice it's current velocity if it's close
 * to the player, within about 10 tiles. You only have to apply this speed change to the
 * x velocity, the y velocity will be left unchanged.
 * 
 * When the player moves far enough away again, the balloon should return to it's original velocity.
 * 
 * You can implement this method how you see fit, there's no one way of doing it. Look at events that
 * are fired to get the player position
 */
export default class ZeroGravity extends BalloonState {
	onEnter(): void {
		this.gravity = 0;

		(<AnimatedSprite>this.owner).animation.play("IDLE", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);

        this.parent.velocity.x = this.parent.direction.x * this.parent.speed;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	// overwrite handleInput to check for player position and update velocity accordingly.
	handleInput(event: GameEvent): void {
		//console.log("CHILD");
		if (event.type == HW5_Events.SUIT_COLOR_CHANGE) {
			let new_color = event.data.get("color");
			if (this.parent.color == new_color){
				this.finished(BalloonStates.SINKING);
			}
			else {
				if (this.parent.color == HW5_Color.RED) {
					if (new_color == HW5_Color.BLUE) {
						this.finished(BalloonStates.ZEROGRAVITY);
					} else {
						this.finished(BalloonStates.RISING);
					}
				} else if (this.parent.color == HW5_Color.BLUE) {
					if (new_color == HW5_Color.RED) {
						this.finished(BalloonStates.ZEROGRAVITY);
					} else {
						this.finished(BalloonStates.RISING);
					}
				} else if (this.parent.color == HW5_Color.GREEN) {
					if (new_color == HW5_Color.RED) {
						this.finished(BalloonStates.RISING);
					} else {
						this.finished(BalloonStates.ZEROGRAVITY);
					}
				} 
			}
		}
		else if (event.type == HW5_Events.PLAYER_MOVE) {
			if (this.gravity === 0) {
				let pos = event.data.get("position");
				let dx = Math.pow(this.owner.position.x - pos.x, 2);
				let dy = Math.pow(this.owner.position.y - pos.y, 2);

				if (Math.sqrt(dx + dy) <= 320) {
					
					this.parent.speed = 200;
				}
				else {
					this.parent.speed = 100;
				}
			}
		}
		
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();

		return {};
	}
}