import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { HW5_Color } from "../hw5_color";
import { HW5_Events } from "../hw5_enums";
import Idle from "./ShieldStates/Idle";
// import Idle from "./PlayerStates/Idle";

export enum ShieldStates {
    IDLE = "idle",
    ROPE = "rope",
    BASH = "bash",
	SHIELD_WALL = "shield wall",
	GROUND_SMASH = "ground smash",
    FRISBEE = "frisbee"
}

export default class ShieldController extends StateMachineAI {
    protected owner: GameNode;
    tilemap: OrthogonalTilemap;
    suitColor: HW5_Color;
    player:GameNode;


    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;


        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;

        this.player = options.player;
        this.initializePlatformer();
    }

    initializePlatformer(): void {
        let idle = new Idle(this, this.owner);
		this.addState(ShieldStates.IDLE, idle);
        
        this.initialize(ShieldStates.IDLE, {player: this.player});
    }

    changeState(stateName: string): void {

        super.changeState(stateName);
    }

    

    update(deltaT: number): void {
		super.update(deltaT);
        //console.log(this.player.position);
		// if(this.currentState instanceof Jump){
		// 	Debug.log("shieldstate", "Shield State: IDLE");
		// } else if (this.currentState instanceof Walk){
		// 	Debug.log("shieldstate", "Shield State: ROPE");
		// } else if (this.currentState instanceof Run){
		// 	Debug.log("shieldstate", "Shield State: Run");
		// } else if (this.currentState instanceof Idle){
		// 	Debug.log("shieldstate", "Shield State: Idle");
		// } else if(this.currentState instanceof Fall){
        //     Debug.log("shieldstate", "Shield State: Fall");
        // }
	}
}