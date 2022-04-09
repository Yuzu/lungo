import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Receiver from "../../../Wolfie2D/Events/Receiver";
import Graphic from "../../../Wolfie2D/Nodes/Graphic";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { Lungo_Events } from "../../Lungo_enums";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";

/**
 * This class controls our bullet behavior. Bullets will start out at a certain speed and then accelerate until they either
 * hit a obstacle or leave the screen.
 */
export default class BulletBehavior implements AI  {
    // The owner of this AI
    owner: GameNode;

    // The velocity
    private current_speed: number;
    private start_speed: number;
    //Direction and velocity for the StateMachine
    direction: Vec2 = Vec2.ZERO;
	velocity: Vec2 = Vec2.ZERO;

    // Some vars to keep put bounds on the speed of the bullet
    static SPEED_INC: number = 75;
    static MAX_SPEED: number = 700;

    reversed: boolean = false; //not sure if we need this


    private weight: number;
    private enemyPos: Vec2;
    private playerPos: Vec2;

//emitter to destroy bullet when contact with collidables
    private emitter: Emitter;


    initializeAI(owner: GameNode, options: Record<string, any>): void {

        console.log(options);
        this.owner = owner;
        this.current_speed = options.startSpeed;
        this.weight = options.weight;
        this.playerPos = options.enemyPos;


        let xValue = this.playerPos.x;
        let yValue = this.playerPos.y;
        let divisor = Math.abs(xValue) + Math.abs(yValue);
        this.direction = new Vec2(xValue/divisor, yValue/divisor);
        this.velocity = new Vec2(-1, 1);

        this.emitter = new Emitter();


        (<AnimatedSprite>this.owner).animation.play("IDLE", true);

    }

    activate(options: Record<string, any>): void {
        this.start_speed = options.speed;
        this.current_speed = this.start_speed;
    }


    handleEvent(event: GameEvent): void {
        // If the bullet used was the same as this bullet, then reset the speed
        if (event.data.get("id") == this.owner.id) {
            this.current_speed = this.start_speed;
        }
    }


    update(deltaT: number): void {
        //console.log(this.enemyPos.x);
        //this.direction = new Vec2(Math.atan(this.enemyPos.x - this.owner.position.x), Math.atan(this.enemyPos.y - this.owner.position.y));


        //While this bullet is active, accelerate the bullet to a max speed over time. 
        this.current_speed += deltaT * BulletBehavior.SPEED_INC;
        this.current_speed = MathUtils.clamp(this.current_speed, this.start_speed, BulletBehavior.MAX_SPEED);

        this.velocity.x = this.direction.x * this.current_speed;
        this.velocity.y = this.direction.y * this.current_speed;

		this.owner.move(this.velocity.scaled(deltaT));
        // Update the position
        //this.owner.position.add(Vec2.UP.scaled(deltaT * this.current_speed));
        if (this.owner.onCeiling || this.owner.onGround || this.owner.onWall) {
            this.emitter.fireEvent(Lungo_Events.BALLOON_POPPED, {owner: this.owner.id}); 

		}

    }

    destroy(): void {
        
    }

}