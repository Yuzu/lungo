import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { Lungo_Color } from "../../Lungo_color";
import { Lungo_Events } from "../../Lungo_enums";
import BalloonController, { BalloonStates } from "./BalloonController";

export default abstract class BalloonState extends State {
	owner: GameNode;
	gravity: number = 500;
	parent: BalloonController;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);

		this.owner = owner;
	}

	handleInput(event: GameEvent): void {

		if (event.type == Lungo_Events.PLAYER_MOVE) {
			if (this.parent.reversed) {
				let pos = event.data.get("position");
				let dx = Math.pow(this.owner.position.x - pos.x, 2);
				let dy = Math.pow(this.owner.position.y - pos.y, 2);
				//console.log(Math.sqrt(dx + dy));
				if (Math.sqrt(dx + dy) >= 35) {
					console.log("balloon is collidable again");
					this.parent.reversed = false;
				}
			}
			
			
		}
		
	}

	update(deltaT: number): void {
		// Do gravity
		this.parent.velocity.y += this.gravity * deltaT;

		if (this.owner.onWall) {
			// Flip around
			this.parent.direction.x *= -1;
			(<AnimatedSprite>this.owner).invertX = !(<AnimatedSprite>this.owner)
				.invertX;
		}

		if (this.owner.onCeiling || this.owner.onGround) {
			if (this.gravity != 0) {
				this.parent.velocity.y =
					(Math.sign(-this.parent.velocity.y) * this.parent.ySpeed);
			}
			else{
				this.parent.velocity.y =
					(Math.sign(-this.parent.velocity.y) * MathUtils.clamp(Math.abs(this.parent.velocity.y), 0, this.parent.ySpeed));
			}
		}
	}
}
