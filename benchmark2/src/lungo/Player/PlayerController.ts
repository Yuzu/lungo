import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { Lungo_Color } from "../Lungo_color";
import { Lungo_Events } from "../Lungo_enums";
import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import InAir from "./PlayerStates/InAir";
import Jump from "./PlayerStates/Jump";
import Run from "./PlayerStates/Run";
import Walk from "./PlayerStates/Walk";


export enum PlayerType {
    PLATFORMER = "platformer",
    TOPDOWN = "topdown"
}

export enum PlayerStates {
    IDLE = "idle",
    WALK = "walk",
	RUN = "run",
	JUMP = "jump",
    FALL = "fall",
	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachineAI {
    protected owner: GameNode;
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
	MIN_SPEED: number = 200;
    MAX_SPEED: number = 300;
    tilemap: OrthogonalTilemap;
    shield: GameNode;


    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;

        this.initializePlatformer();

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;

        this.shield = undefined;

        owner.tweens.add("flip", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

        owner.tweens.add("death", {
            startDelay: 0,
            duration: 3000,
            onEnd: Lungo_Events.PLAYER_KILLED,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 10*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                },
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUINT
                }
            ]
        })
    }

    initializePlatformer(): void {
        this.speed = 400;

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
		let run = new Run(this, this.owner);
		this.addState(PlayerStates.RUN, run);
		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        let fall = new Fall(this, this.owner);
        this.addState(PlayerStates.FALL, fall);
        
        this.initialize(PlayerStates.IDLE, {shield: this.shield});

    }

    changeState(stateName: string): void {
        // If we jump or fall, push the state so we can go back to our current state later
        // unless we're going from jump to fall or something
        if((stateName === PlayerStates.JUMP || stateName === PlayerStates.FALL) && !(this.stack.peek() instanceof InAir)){
            this.stack.push(this.stateMap.get(stateName));
        }

        super.changeState(stateName);
    }

    // HOMEWORK 5 - TODO
    /**
     * We want to detect when our player is moving over one of the switches in the world, and along with the sound
     * and label changes, we also visually want to change the tile.
     * 
     * You'll have to figure out when the player is over a tile, and then change that tile to the ON tile that you see in
     * tileset.png in tilemaps. You also need to send the PLAYER_HIT_SWITCH event so elements can be handled in GameLevel.ts
     * 
     * Make use of the tilemap field in the PlayerController and the methods at it's disposal.
     * 
     */
    update(deltaT: number): void {
		super.update(deltaT);

        if (this.owner.onGround) {
            // 8 indicates an "off" tile.
            // if (this.tilemap && this.tilemap.getTileAtWorldPosition(new Vec2(this.owner.position.x, this.owner.position.y + 32)) === 8) {
            //     let tileLocation = this.tilemap.getColRowAt(new Vec2(this.owner.position.x, this.owner.position.y + 32));
            //     this.tilemap.setTileAtRowCol(tileLocation, 9);

            //     this.emitter.fireEvent(Lungo_Events.PLAYER_HIT_SWITCH);
            // }
        }
		if(this.currentState instanceof Jump){
			Debug.log("playerstate", "Player State: Jump");
		} else if (this.currentState instanceof Walk){
			Debug.log("playerstate", "Player State: Walk");
		} else if (this.currentState instanceof Run){
			Debug.log("playerstate", "Player State: Run");
		} else if (this.currentState instanceof Idle){
			Debug.log("playerstate", "Player State: Idle");
		} else if(this.currentState instanceof Fall){
            Debug.log("playerstate", "Player State: Fall");
        }
	}
}