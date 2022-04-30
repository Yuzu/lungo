import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { Lungo_Color } from "../Lungo_color";
import GameLevel from "./GameLevel";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Input from "../../Wolfie2D/Input/Input";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level4 from "./Level4";
import Level5 from "./Level5";
import Level6 from "./Level6";

export default class Level3 extends GameLevel {
    // HOMEWORK 5 - TODO
    /**
     * Decide which resource to keep and which to cull.
     * 
     * Not all of these loads are needed. Decide which to remove and handle keeping resources in Level1
     */

    protected trampolineIcon: Sprite;
    protected shieldIcon: Sprite;

    loadScene(): void {
        // Load resources
        this.load.tilemap("level3", "final_build/dist/lungo_assets/tilemaps/level3.json");
        this.load.spritesheet("player", "final_build/dist/lungo_assets/spritesheets/lungo.json");
        this.load.spritesheet("shield", "final_build/dist/lungo_assets/spritesheets/shield.json");
        this.load.spritesheet("red", "final_build/dist/lungo_assets/spritesheets/redBalloon.json");
        this.load.spritesheet("blue", "final_build/dist/lungo_assets/spritesheets/blueBalloon.json");
        this.load.spritesheet("green", "final_build/dist/lungo_assets/spritesheets/greenBalloon.json");
        this.load.spritesheet("basicEnemy", "final_build/dist/lungo_assets/spritesheets/basicEnemy.json");
        this.load.image("trampolineIcon", "final_build/dist/lungo_assets/images/trampoline.png");
        this.load.image("shieldIcon", "final_build/dist/lungo_assets/images/shield.png");
        this.load.audio("jump", "final_build/dist/lungo_assets/sounds/jump.wav");
        this.load.audio("switch", "final_build/dist/lungo_assets/sounds/switch.wav");
        this.load.audio("player_death", "final_build/dist/lungo_assets/sounds/player_death.wav");
        this.load.audio("pop", "final_build/dist/lungo_assets/sounds/pop.wav");
        this.load.spritesheet("axeEnemy", "final_build/dist/lungo_assets/spritesheets/axeEnemy.json");
        this.load.spritesheet("axe", "final_build/dist/lungo_assets/spritesheets/axe.json");
        this.load.spritesheet("bowEnemy", "final_build/dist/lungo_assets/spritesheets/bowEnemy.json");
        this.load.spritesheet("arrow", "final_build/dist/lungo_assets/spritesheets/arrow.json");
        // HOMEWORK 5 - TODO
        // You'll want to change this to your level music
        this.load.audio("level_music", "final_build/dist/lungo_assets/music/bingbongdingdong.mp3");

    }

    unloadScene(){
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
    }

    startScene(): void {
        // Add the level 2 tilemap
        this.add.tilemap("level3", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 96*32);

        this.playerSpawn = new Vec2(3*32, 90*32);
        this.shieldSpawn = this.playerSpawn;

        // Do generic setup for a GameLevel
        super.startScene();

        this.trampolineIcon = this.add.sprite("trampolineIcon", "UI");
        this.trampolineIcon.position.set(250, 25);

        this.shieldIcon = this.add.sprite("shieldIcon", "UI");
        this.shieldIcon.position.set(300, 25);

        this.addLevelEnd(new Vec2(0, 29), new Vec2(5, 5));

        // Add in our green balloons to the enemies
        for(let pos of [new Vec2(18, 8), new Vec2(25, 3), new Vec2(52, 5)]){
            this.addBalloon("red", pos, {color: Lungo_Color.RED});
        }

        for(let pos of [new Vec2(3, 4), new Vec2(33, 10)]){
            this.addBalloon("green", pos, {color: Lungo_Color.GREEN});
        }

        for(let pos of [new Vec2(20, 3), new Vec2(41,4)]){
            this.addBalloon("blue", pos, {color: Lungo_Color.BLUE});
        }

        // Add enemies
        this.addEnemy("basicEnemy", new Vec2(8, 81), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("axeEnemy", new Vec2(16, 81), {firingCooldown: 2500, projectileStartSpeed:  600, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(27, 81), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("axeEnemy", new Vec2(38, 81), {firingCooldown: 2500, projectileStartSpeed:  600, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(41, 81), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("bowEnemy", new Vec2(62, 86), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(58, 81), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("axeEnemy", new Vec2(62, 72), {firingCooldown: 2500, projectileStartSpeed:  700, projectileWeight: 2});
        this.addEnemy("bowEnemy", new Vec2(62, 66), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(50, 60), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("axeEnemy", new Vec2(62, 51), {firingCooldown: 2500, projectileStartSpeed:  700, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(62, 48), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(52, 37), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});

        this.addEnemy("bowEnemy", new Vec2(38, 31), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("axeEnemy", new Vec2(21, 30), {firingCooldown: 2500, projectileStartSpeed:  700, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(6, 8), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(1, 13), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("axeEnemy", new Vec2(19, 30), {firingCooldown: 2500, projectileStartSpeed:  700, projectileWeight: 2});


        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
        let currentBest = localStorage.getItem("level3_best");
        if (currentBest) {
            let currentBest_int = parseInt(currentBest);
            this.bestTime.text = "Current Best Time: " + Math.floor(currentBest_int / 60) + ":" + ((currentBest_int % 60) < 10 ? "0" + (currentBest_int % 60) : currentBest_int % 60);
        }
        this.levelLabel.text = "Level: 3";

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