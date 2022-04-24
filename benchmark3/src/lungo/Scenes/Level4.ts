import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { Lungo_Color } from "../Lungo_color";
import GameLevel from "./GameLevel";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default class Level4 extends GameLevel {
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
        this.load.tilemap("level4", "lungo_assets/tilemaps/level4.json");
        this.load.spritesheet("player", "lungo_assets/spritesheets/lungo.json");
        this.load.spritesheet("shield", "lungo_assets/spritesheets/shield.json");
        this.load.spritesheet("red", "lungo_assets/spritesheets/redBalloon.json");
        this.load.spritesheet("blue", "lungo_assets/spritesheets/blueBalloon.json");
        this.load.spritesheet("green", "lungo_assets/spritesheets/greenBalloon.json");
        this.load.spritesheet("basicEnemy", "lungo_assets/spritesheets/basicEnemy.json");
        this.load.image("trampolineIcon", "lungo_assets/images/trampoline.png");
        this.load.image("shieldIcon", "lungo_assets/images/shield.png");
        this.load.audio("jump", "lungo_assets/sounds/jump.wav");
        this.load.audio("switch", "lungo_assets/sounds/switch.wav");
        this.load.audio("player_death", "lungo_assets/sounds/player_death.wav");
        this.load.audio("pop", "lungo_assets/sounds/pop.wav")
        // HOMEWORK 5 - TODO
        // You'll want to change this to your level music
        this.load.audio("level_music", "lungo_assets/music/wunglewoogie.mp3");

    }

    startScene(): void {
        // Add the level 4 tilemap
        this.add.tilemap("level4", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 96*32, 48*32);

        this.playerSpawn = new Vec2(7*32, 45*32);
        this.shieldSpawn = this.playerSpawn;

        // Do generic setup for a GameLevel
        super.startScene();

        this.trampolineIcon = this.add.sprite("trampolineIcon", "UI");
        this.trampolineIcon.position.set(250, 25);

        this.shieldIcon = this.add.sprite("shieldIcon", "UI");
        this.shieldIcon.position.set(300, 25);

        this.addLevelEnd(new Vec2(92, 1), new Vec2(5, 1));

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
        this.addEnemy("basicEnemy", new Vec2(33, 17), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(35, 17), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(26, 8), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(38, 81), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(12, 8), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(5, 34), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(93, 36), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(79, 37), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(84, 41), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(75, 40), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(57, 41), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(50, 41), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(27, 41), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});

        this.addEnemy("basicEnemy", new Vec2(33, 43), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(19, 45), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(12, 25), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(5, 20), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(8, 12), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(92, 16), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(89, 6), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(94, 5), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(80, 24), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});

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