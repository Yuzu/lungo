import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { Lungo_Color } from "../Lungo_color";
import GameLevel from "./GameLevel";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default class Level5 extends GameLevel {
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
        this.load.tilemap("level5", "benchmark2/dist/lungo_assets/tilemaps/level5.json");
        this.load.spritesheet("player", "benchmark2/dist/lungo_assets/spritesheets/lungo.json");
        this.load.spritesheet("shield", "benchmark2/dist/lungo_assets/spritesheets/shield.json");
        this.load.spritesheet("red", "benchmark2/dist/lungo_assets/spritesheets/redBalloon.json");
        this.load.spritesheet("blue", "benchmark2/dist/lungo_assets/spritesheets/blueBalloon.json");
        this.load.spritesheet("green", "benchmark2/dist/lungo_assets/spritesheets/greenBalloon.json");
        this.load.spritesheet("basicEnemy", "benchmark2/dist/lungo_assets/spritesheets/basicEnemy.json");
        this.load.image("trampolineIcon", "benchmark2/dist/lungo_assets/images/trampoline.png");
        this.load.image("shieldIcon", "benchmark2/dist/lungo_assets/images/shield.png");
        this.load.audio("jump", "benchmark2/dist/lungo_assets/sounds/jump.wav");
        this.load.audio("switch", "benchmark2/dist/lungo_assets/sounds/switch.wav");
        this.load.audio("player_death", "benchmark2/dist/lungo_assets/sounds/player_death.wav");
        this.load.audio("pop", "benchmark2/dist/lungo_assets/sounds/pop.wav")
        // HOMEWORK 5 - TODO
        // You'll want to change this to your level music
        this.load.audio("level_music", "benchmark2/dist/lungo_assets/music/electricmambo.mp3");

    }

    startScene(): void {
        // Add the level 2 tilemap
        this.add.tilemap("level5", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 96*32);

        this.playerSpawn = new Vec2(3*32, 94*32);
        this.shieldSpawn = this.playerSpawn;

        // Do generic setup for a GameLevel
        super.startScene();

        this.trampolineIcon = this.add.sprite("trampolineIcon", "UI");
        this.trampolineIcon.position.set(250, 25);

        this.shieldIcon = this.add.sprite("shieldIcon", "UI");
        this.shieldIcon.position.set(300, 25);

        this.addLevelEnd(new Vec2(57, 3), new Vec2(5, 5));

        // Add in our green balloons to the enemies
        for(let pos of [new Vec2(18, 30), new Vec2(25, 20), new Vec2(52, 5), new Vec2(13, 71)]){
            this.addBalloon("red", pos, {color: Lungo_Color.RED});
        }

        for(let pos of [new Vec2(3, 4),new Vec2(8, 14), new Vec2(33, 10)]){
            this.addBalloon("green", pos, {color: Lungo_Color.GREEN});
        }

        for(let pos of [new Vec2(20, 3), new Vec2(41,4)]){
            this.addBalloon("blue", pos, {color: Lungo_Color.BLUE});
        }

        // Add enemies
        this.addEnemy("basicEnemy", new Vec2(13, 75), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(10, 68), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(7, 56), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(10, 36), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(3, 28), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(17, 20), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(9, 15), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(31, 60), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(46, 84), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(48, 61), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(55, 57), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(50, 53), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(48, 41), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(59, 36), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(40, 28), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(56, 21), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(48, 8), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});


        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});

        
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
    }
}