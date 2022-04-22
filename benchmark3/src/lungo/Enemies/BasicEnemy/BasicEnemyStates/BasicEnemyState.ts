import State from "../../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { Lungo_Events } from "../../../Lungo_enums";
import BasicEnemyController from "../BasicEnemyController";

export default abstract class BasicEnemyState extends State {
	owner: GameNode;
	gravity: number = 1000;
	parent: BasicEnemyController;
	firingTimer: Timer;
    canFire: boolean;

    constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		console.log("Constructor called for basic enemy state");
		this.owner = owner;
		if (this.parent.firingCooldown) {
			this.firingTimer = new Timer(this.parent.firingCooldown);
		}
		else {
			this.firingTimer = new Timer(3000);
		}
		
        this.canFire = true;
	}
	update(deltaT: number): void {
		//console.log(this.canFire);
		if (this.firingTimer.hasRun() && !this.canFire){
			this.canFire = true;
			this.firingTimer.reset();
		}

		this.parent.velocity.y += this.gravity*deltaT;
	}
}
