import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { Lungo_Color } from "../Lungo_color";
import GameLevel from "./GameLevel";
import Level2 from "./Level2";


export default class Level1 extends GameLevel {


    // HOMEWORK 5 - TODO
    /**
     * Add your balloon pop sound here and use it throughout the code
     */
    loadScene(): void {
        // Load resources
        this.load.tilemap("level1", "lungo_assets/tilemaps/level1.json");
        this.load.spritesheet("player", "lungo_assets/spritesheets/lungo.json");
        this.load.spritesheet("shield", "lungo_assets/spritesheets/shield.json");
        this.load.spritesheet("red", "lungo_assets/spritesheets/redBalloon.json");
        this.load.spritesheet("blue", "lungo_assets/spritesheets/blueBalloon.json");
        this.load.spritesheet("basicEnemy", "lungo_assets/spritesheets/basicEnemy.json");
        this.load.audio("jump", "lungo_assets/sounds/jump.wav");
        this.load.audio("switch", "lungo_assets/sounds/switch.wav");
        this.load.audio("player_death", "lungo_assets/sounds/player_death.wav");
        this.load.audio("pop", "lungo_assets/sounds/pop.wav")
        // HOMEWORK 5 - TODO
        // You'll want to change this to your level music
        this.load.audio("level_music", "lungo_assets/music/menu.mp3");

    }

    // HOMEWORK 5 - TODO
    /**
     * Decide which resource to keep and which to cull.
     * 
     * Check out the resource manager class.
     * 
     * Figure out how to save resources from being unloaded, and save the ones that are needed
     * for level 2.
     * 
     * This will let us cut down on load time for the game (although there is admittedly
     * not a lot of load time for such a small project).
     */
    unloadScene(){
        // Keep resources - this is up to you
        this.load.keepSpritesheet("player");
        this.load.keepSpritesheet("red");
        this.load.keepSpritesheet("blue");
        this.load.keepSpritesheet("green");
        this.load.keepAudio("jump");
        this.load.keepAudio("switch");
        this.load.keepAudio("player_death");
        this.load.keepAudio("pop")

        this.load.keepAudio("level_music");
    }

    startScene(): void {
        // Add the level 1 tilemap
        this.add.tilemap("level1", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 96*32, 32*32);

        this.playerSpawn = new Vec2(4*32, 26*32);
        this.shieldSpawn = this.playerSpawn;

        // Set the total switches and balloons in the level
        this.totalSwitches = 4;
        this.totalBalloons = 6;

        // Do generic setup for a GameLevel
        super.startScene();

        this.addLevelEnd(new Vec2(91, 3), new Vec2(5, 8));

        this.nextLevel = Level2;

        // Add balloons of various types, just red and blue for the first level
        for(let pos of [new Vec2(18, 8), new Vec2(25, 3), new Vec2(52, 5)]){
            this.addBalloon("red", pos, {color: Lungo_Color.RED});
        }

        for(let pos of [new Vec2(20, 3), new Vec2(41,4), new Vec2(3, 4)]){
            this.addBalloon("red", pos, {color: Lungo_Color.RED});
        }

        // Add enemies
        this.addEnemy("basicEnemy", new Vec2(29, 29), {firingCooldown: 2500, projectileStartSpeed:  200, projectileWeight: 2});

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
        
        let currentBest = localStorage.getItem("level1_best");
        if (currentBest) {
            let currentBest_int = parseInt(currentBest);
            this.bestTime.text = "Current Best Time: " + Math.floor(currentBest_int / 60) + ":" + ((currentBest_int % 60) < 10 ? "0" + (currentBest_int % 60) : currentBest_int % 60);
        }

        this.levelLabel.text = "Level: 1";
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}