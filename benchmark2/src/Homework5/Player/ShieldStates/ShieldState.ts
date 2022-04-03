import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { HW5_Events } from "../../hw5_enums";
import ShieldController from "../ShieldController";


export default abstract class ShieldState extends State {
	owner: GameNode;
	parent: ShieldController;
	player: GameNode;

	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		this.owner = owner;
	}

	handleInput(event: GameEvent): void {
		if (event.type == HW5_Events.SHIELD_WALL) {
			console.log("Shield wall activated! Updating state.");
			this.finished(event.type);
		}
	}


	update(deltaT: number): void {
        console.log("Need to implement update for shield state!");
	}
}