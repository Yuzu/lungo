import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { Lungo_Color } from "../Lungo_color";
import GameLevel from "./GameLevel";
import Level2 from "./Level2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Input from "../../Wolfie2D/Input/Input";
import Level3 from "./Level3";
import Level4 from "./Level4";
import Level5 from "./Level5";
import Level6 from "./Level6";

export default class Level1 extends GameLevel {

    protected trampolineIcon: Sprite;
    protected shieldIcon: Sprite;

    // HOMEWORK 5 - TODO
    /**
     * Add your balloon pop sound here and use it throughout the code
     */
    loadScene(): void {
        // Load resources
        this.load.tilemap("level1", "benchmark3/dist/lungo_assets/tilemaps/level1.json");
        this.load.spritesheet("player", "benchmark3/dist/lungo_assets/spritesheets/lungo.json");
        this.load.spritesheet("shield", "benchmark3/dist/lungo_assets/spritesheets/shield.json");
        this.load.spritesheet("red", "benchmark3/dist/lungo_assets/spritesheets/redBalloon.json");
        this.load.spritesheet("blue", "benchmark3/dist/lungo_assets/spritesheets/blueBalloon.json");
        this.load.spritesheet("green", "benchmark3/dist/lungo_assets/spritesheets/greenBalloon.json");
        this.load.spritesheet("basicEnemy", "benchmark3/dist/lungo_assets/spritesheets/basicEnemy.json");
        this.load.image("trampolineIcon", "benchmark3/dist/lungo_assets/images/trampoline.png");
        this.load.image("shieldIcon", "benchmark3/dist/lungo_assets/images/shield.png");
        this.load.audio("jump", "benchmark3/dist/lungo_assets/sounds/jump.wav");
        this.load.audio("switch", "benchmark3/dist/lungo_assets/sounds/switch.wav");
        this.load.audio("player_death", "benchmark3/dist/lungo_assets/sounds/player_death.wav");
        this.load.audio("pop", "benchmark3/dist/lungo_assets/sounds/pop.wav");
        
        // HOMEWORK 5 - TODO
        // You'll want to change this to your level music
        this.load.audio("level_music", "benchmark3/dist/lungo_assets/music/cowbell.mp3");

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
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
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

        this.trampolineIcon = this.add.sprite("trampolineIcon", "UI");
        this.trampolineIcon.position.set(250, 25);

        this.shieldIcon = this.add.sprite("shieldIcon", "UI");
        this.shieldIcon.position.set(300, 25);
        // Add balloons of various types, just red and blue for the first level
        for(let pos of [new Vec2(18, 8), new Vec2(25, 3), new Vec2(52, 5)]){
            this.addBalloon("red", pos, {color: Lungo_Color.RED});
        }

        for(let pos of [new Vec2(20, 3), new Vec2(41,4), new Vec2(3, 4)]){
            this.addBalloon("red", pos, {color: Lungo_Color.RED});
        }

        // Add enemies
        this.addEnemy("basicEnemy", new Vec2(29, 29), {firingCooldown: 2500, projectileStartSpeed:  200, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(35, 29), {firingCooldown: 2500, projectileStartSpeed:  200, projectileWeight: 2});

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

        // TODO - this needs to be in every level. it feels like bad practice but shrug.
        if (this.shieldTrampolineTimer.isStopped()) {
            this.trampolineIcon.alpha = 1;
        }
        else {
            this.trampolineIcon.alpha = 0.4;
        }

        if (this.shieldWallTimer.isStopped()) {
            this.shieldIcon.alpha = 1;
        }
        else {
            this.shieldIcon.alpha = 0.4;
        }
        let sceneOptions = {
            physics: {
                groupNames: ["ground", "player", "balloon", "shield", "enemy", "projectile"],
                collisions:
                [
                    [0, 1, 1, 0, 1, 1],
                    [1, 0, 0, 1, 1, 1],
                    [1, 0, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 1],
                    [1, 1, 0, 0, 0, 0],
                    [1, 1, 0, 1, 0, 0]
                ]
            }
        }

        if(Input.isKeyPressed("1")){
            this.sceneManager.changeToScene(Level1, {}, sceneOptions);
        }
        else if(Input.isKeyPressed("2")){ 
            this.sceneManager.changeToScene(Level2, {}, sceneOptions);
        }
        else if(Input.isKeyPressed("3")){
            this.sceneManager.changeToScene(Level3, {}, sceneOptions);
        }
        else if(Input.isKeyPressed("4")){
            this.sceneManager.changeToScene(Level4, {}, sceneOptions);
        }
        else if(Input.isKeyPressed("5")){
            this.sceneManager.changeToScene(Level5, {}, sceneOptions);
        }
        else if(Input.isKeyPressed("6")){
            this.sceneManager.changeToScene(Level6, {}, sceneOptions);
        }
    }
}