import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import { Lungo_Events } from "../../Lungo_enums";
import { Lungo_Color } from "../../Lungo_color";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import Debug from "../../../Wolfie2D/Debug/Debug";
import Idle from "./BasicEnemyStates/Idle";
import Aggro from "./BasicEnemyStates/Aggro";

export enum BasicEnemyStates {
    IDLE = "idle",
    PATROL = "patrol",
    AGGRO = "aggro"
}

export default class BasicEnemyController extends StateMachineAI {
    protected owner: GameNode;
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
    health: number = 3;
	MIN_SPEED: number = 200;
    MAX_SPEED: number = 300;
    tilemap: OrthogonalTilemap;

    firingCooldown: number;
    projectileStartSpeed: number;
    projectileWeight: number;

    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;

        this.initializePlatformer();

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.receiver.subscribe(Lungo_Events.PLAYER_MOVE);
        
        this.firingCooldown = options.firingCooldown;
        this.projectileStartSpeed = options.projectileStartSpeed;
        this.projectileWeight = options.projectileWeight;

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
		this.addState(BasicEnemyStates.IDLE, idle);
        
        let aggro = new Aggro(this, this.owner);
        this.addState(BasicEnemyStates.AGGRO, aggro);
        
        this.initialize(BasicEnemyStates.IDLE);
    }

    changeState(stateName: string): void {
        console.log("changing state " + stateName);
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

		if(this.currentState instanceof Idle){
			Debug.log("playerstate", "BasicEnemyState: Idle");
		}

	}
}