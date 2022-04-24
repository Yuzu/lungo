import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { Lungo_Color } from "../Lungo_color";
import GameLevel from "./GameLevel";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

import Input from "../../Wolfie2D/Input/Input";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";

export default class Level6 extends GameLevel {

    protected trampolineIcon: Sprite;
    protected shieldIcon: Sprite;

    loadScene(): void {
        // Load resources
        this.load.tilemap("level6", "lungo_assets/tilemaps/level6.json");

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

        this.load.audio("level_music", "lungo_assets/music/menu.mp3");

    }

    startScene(): void {

        this.add.tilemap("level6", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 128*32);

        //this.playerSpawn = new Vec2(3*32, 123*32); // normal spawn
        this.playerSpawn = new Vec2(30*32, 9*32); // spawn at top (cheat/testing purposes)
        this.shieldSpawn = this.playerSpawn;

        // Do generic setup for a GameLevel
        super.startScene();

        this.trampolineIcon = this.add.sprite("trampolineIcon", "UI");
        this.trampolineIcon.position.set(250, 25);

        this.shieldIcon = this.add.sprite("shieldIcon", "UI");
        this.shieldIcon.position.set(300, 25);

        this.addLevelEnd(new Vec2(25, 3), new Vec2(9, 1));

        // Add in our green balloons to the enemies
        for(let pos of [new Vec2(15, 108), new Vec2(54, 97), new Vec2(33, 85)]){
            this.addBalloon("red", pos, {color: Lungo_Color.RED});
        }

        for(let pos of [new Vec2(3, 4), new Vec2(10, 53), new Vec2(35, 49)]){
            this.addBalloon("green", pos, {color: Lungo_Color.GREEN});
        }

        for(let pos of [new Vec2(57, 8), new Vec2(60, 12)]){
            this.addBalloon("blue", pos, {color: Lungo_Color.BLUE});
        }

        this.addEnemy("basicEnemy", new Vec2(28, 116), {firingCooldown: 2500, projectileStartSpeed:  400, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(1, 111), {firingCooldown: 2500, projectileStartSpeed:  500, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(48, 110), {firingCooldown: 1000, projectileStartSpeed:  300, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(33, 103), {firingCooldown: 2500, projectileStartSpeed:  700, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(34, 117), {firingCooldown: 2500, projectileStartSpeed:  700, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(59, 91), {firingCooldown: 2500, projectileStartSpeed:  700, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(1, 93), {firingCooldown: 2500, projectileStartSpeed:  700, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(23, 91), {firingCooldown: 2500, projectileStartSpeed:  700, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(6, 80), {firingCooldown: 2500, projectileStartSpeed:  700, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(61, 70), {firingCooldown: 2500, projectileStartSpeed:  500, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(34, 72), {firingCooldown: 2500, projectileStartSpeed:  500, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(22, 57), {firingCooldown: 2500, projectileStartSpeed:  500, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(60, 59), {firingCooldown: 2500, projectileStartSpeed:  500, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(26, 34), {firingCooldown: 2500, projectileStartSpeed:  500, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(2, 44), {firingCooldown: 2500, projectileStartSpeed:  500, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(8, 36), {firingCooldown: 2500, projectileStartSpeed:  500, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(58, 27), {firingCooldown: 2500, projectileStartSpeed:  500, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(33, 14), {firingCooldown: 6000, projectileStartSpeed:  800, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(39, 8), {firingCooldown: 2500, projectileStartSpeed:  600, projectileWeight: 2});
        this.addEnemy("basicEnemy", new Vec2(120, 8), {firingCooldown: 2500, projectileStartSpeed:  500, projectileWeight: 2});

        let currentBest = localStorage.getItem("level6_best");
        if (currentBest) {
            let currentBest_int = parseInt(currentBest);
            this.bestTime.text = "Current Best Time: " + Math.floor(currentBest_int / 60) + ":" + ((currentBest_int % 60) < 10 ? "0" + (currentBest_int % 60) : currentBest_int % 60);
        }
        this.levelLabel.text = "Level: 6";
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
            // Scene has started, so start playing music
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
        }
        else if(Input.isKeyPressed("2")){ 
            this.sceneManager.changeToScene(Level2, {}, sceneOptions);
            // Scene has started, so start playing music
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
        }
        else if(Input.isKeyPressed("3")){
            this.sceneManager.changeToScene(Level3, {}, sceneOptions);
            // Scene has started, so start playing music
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
        }
    }
}