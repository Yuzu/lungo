import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Point from "../../Wolfie2D/Nodes/Graphics/Point";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import BalloonController from "../Enemies/Balloons/BalloonController";
import { Lungo_Color } from "../Lungo_color";
import { Lungo_Events } from "../Lungo_enums";
import Lungo_ParticleSystem from "../Lungo_ParticleSystem";
import PlayerController from "../Player/PlayerController";
import ShieldController from "../Player/ShieldController";
import MainMenu from "./MainMenu";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";


import BasicEnemyController from "../Enemies/BasicEnemy/BasicEnemyController";

import BulletAI from "../Enemies/Projectiles/BulletAI";

import Layer from "../../Wolfie2D/Scene/Layer";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import BulletBehavior from "../Enemies/Projectiles/BulletAI";


// HOMEWORK 5 - TODO
/**
 * Add in some level music.
 * 
 * This can be done here in the base GameLevel class, or in Level1 and Level2,
 * it's up to you.
 */
export default class GameLevel extends Scene {
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;
    // Every level will also have the player's shield, which will be an animated sprite
    protected shieldSpawn: Vec2;
    protected shield: AnimatedSprite;


    // Labels for the UI
    protected static livesCount: number = 10;
    protected livesCountLabel: Label;

    // Stuff to end the level and go to the next level
    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => GameLevel;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;
    
    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;
    
    // Custom particle sysyem
    protected system: Lungo_ParticleSystem;


    //Timers for new shield events
    protected shieldWallTimer: Timer;
    protected shieldTrampolineTimer: Timer;

    //We manage a boolean that keeps track of whether or not shieldJump is valid
    //As shield-player collisions can happen multiple times, but we only want it to 
    // happen once
    protected shieldJump: Boolean;

    //CHEAT STUFF
    protected invincible: Boolean = false;
    protected invincibleTimer: Timer;

    // Total ballons and amount currently popped
    protected totalBalloons: number;

    protected balloonsPopped: number;

    // Total switches and amount currently pressed
    protected totalSwitches: number;
    
    protected switchesPressed: number;

    protected isPaused: Boolean;
    protected projectileList: Array<AnimatedSprite>;
    protected enemyList: Array<AnimatedSprite>;

    protected pauseMenu: Layer;

    protected levelTimer: number;
    protected elapsedTime: number;

    protected bestTime: Label;
    protected timeLabel: Label;

    protected levelLabel: Label;
    protected enemyLabel: Label;

    startScene(): void {
        this.balloonsPopped = 0;
        this.switchesPressed = 0;
        GameLevel.livesCount = 10;
        // Do the game level standard initializations
        this.initLayers();
        this.initViewport();
        this.initPlayer();
        this.initShield();
        this.subscribeToEvents();
        this.addUI();

        this.isPaused = false;
        this.projectileList = [];
        this.enemyList = [];
        // Initialize the timers
        this.respawnTimer = new Timer(1000, () => {
            if(GameLevel.livesCount === 0){
                this.sceneManager.changeToScene(MainMenu);
            } else {
                this.respawnPlayer();
                this.player.enablePhysics();
                this.player.unfreeze();
            }
        });
        this.levelTransitionTimer = new Timer(500);
        this.levelEndTimer = new Timer(3000, () => {
            // After the level end timer ends, fade to black and then go to the next scene
            this.levelTransitionScreen.tweens.play("fadeIn");
        });


        //2 second cooldown for SHIELD WALL
        this.shieldWallTimer = new Timer(2000);
        
        //4 second cooldown for SHIELD TRAMPOLINE
        this.shieldTrampolineTimer = new Timer(4000);

        //SET A SMALL TIMER FOR INVINCIBILITY TO PREVENT DOUBLE CLICKS
        this.invincibleTimer = new Timer(150);
        // Start the black screen fade out
        this.levelTransitionScreen.tweens.play("fadeOut");

        // Initially disable player movement
        Input.disableInput();

        this.elapsedTime = 0;

        this.levelTimer = setInterval(() => {
            this.elapsedTime += 1;
            this.timeLabel.text = "Time Elapsed: " + Math.floor(this.elapsedTime / 60) + ":" + ((this.elapsedTime % 60) < 10 ? "0" + (this.elapsedTime % 60) : this.elapsedTime % 60);
        }, 1000);

    }


    updateScene(deltaT: number){

        
        if (Input.isKeyJustPressed("escape")) {
            
            if (!this.isPaused) {
                // pause
                console.log("paused");

                if (this.pauseMenu.isHidden()) {
                    this.pauseMenu.setHidden(false);
                    
                }

                this.enemyList.forEach((enemy) => {
                    enemy.freeze();
                    enemy.disablePhysics();
                    enemy.aiActive = false;
                });

                this.projectileList.forEach((projectile) => {
                    projectile.freeze();
                    projectile.disablePhysics();
                    projectile.aiActive = false;
                });

                this.shield.freeze();
                this.shield.disablePhysics();
                this.shield.aiActive = false;

                this.player.freeze();
                this.player.disablePhysics();
                this.player.aiActive = false;
            }
            else {
                // un-pause
                console.log("un-paused");

                if (!this.pauseMenu.isHidden()) {
                    this.pauseMenu.setHidden(true);
                }
                this.enemyList.forEach((enemy) => {
                    enemy.unfreeze();
                    enemy.enablePhysics();
                    enemy.aiActive = true;
                });

                this.projectileList.forEach((projectile) => {
                    projectile.unfreeze();
                    projectile.enablePhysics();
                    projectile.aiActive = true;
                });

                this.shield.unfreeze();
                this.shield.enablePhysics();
                this.shield.aiActive = true;

                this.player.unfreeze();
                this.player.enablePhysics();
                this.player.aiActive = true;
            }

            this.isPaused = !this.isPaused;
        }

        const viewportCenter = this.viewport.getCenter().clone();
		const baseViewportSize = this.viewport.getHalfSize().scaled(2);



		// Handle the despawing of all other objects that move offscreen
		for(let projectile of this.projectileList){
            if(projectile.ai instanceof BulletBehavior){
                //console.log(projectile.ai.reversed)
            }
			if(projectile.visible){
				this.handleScreenDespawn(projectile, viewportCenter, baseViewportSize);
			}
		}

        // Handle events and update the UI if needed
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            switch(event.type){
                case Lungo_Events.PLAYER_HIT_SWITCH:
                    {
                        // Hit a switch block, so update the label and count
                        this.switchesPressed++;
                        this.timeLabel.text = "Switches Left: " + (this.totalSwitches - this.switchesPressed)

                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "switch", loop: false, holdReference: false});
                    }
                    break;

                case Lungo_Events.PLAYER_HIT_BALLOON:
                    {   
                        console.log("PLAYER HIT");
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));
                        
                        if(node === this.player){
                            // Node is player, other is balloon
                            this.handlePlayerBalloonCollision(<AnimatedSprite>node, <AnimatedSprite>other);
                        } else {
                            // Other is player, node is balloon
                            this.handlePlayerBalloonCollision(<AnimatedSprite>other,<AnimatedSprite>node);

                        }
                    }
                    break;

                case Lungo_Events.SHIELD_HIT:
                    {
                        console.log("SHIELD HIT");
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));
                        
                        if(node === this.shield){
                            // Node is player, other is balloon or projectile
                            
                            this.handleShieldBalloonCollision(<AnimatedSprite>node, <AnimatedSprite>other);
                        } else {
                            // Other is player, node is balloon or projectile
                            this.handleShieldBalloonCollision(<AnimatedSprite>other,<AnimatedSprite>node);

                        }
                    }
                    break;
                case Lungo_Events.SHIELD_TRAMPOLINE_JUMP:
                {
                    console.log("SHIELD TRAMPOLINE JUMP");
                    let node = this.sceneGraph.getNode(event.data.get("node"));
                    let other = this.sceneGraph.getNode(event.data.get("other"));
                    
                    if(node === this.shield){
                        
                        // Node is player, other is shield
                        this.handlePlayerShieldTrampolineJump(<AnimatedSprite>other, <AnimatedSprite>node);
                    } else {
                        // Other is player, node is shield
                        this.handlePlayerShieldTrampolineJump(<AnimatedSprite>node, <AnimatedSprite>other);

                    }
                }
                break;

                case Lungo_Events.BALLOON_POPPED:
                    {
                        
                        
                        // An balloon collided with the player, destroy it and use the particle system
                        this.balloonsPopped++;
                        let node = this.sceneGraph.getNode(event.data.get("owner"));
                        if(node) //node would be null if the bullet collided with player (ig since lungo counts as a wall to the engine? (check bulletAI for bullet destruction implementation))
                            node.destroy();
                    }
                    break;
                    
                case Lungo_Events.PLAYER_ENTERED_LEVEL_END:
                    {
                        //Check if the number of enemies is 0
                        if(!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()){
                            // The player has reached the end of the level
                            this.levelEndTimer.start();
                            this.levelEndLabel.tweens.play("slideIn");
                            

                            // Everything about this feels so wrong... But it works...
                            // We can also check localStorage for these completion times to determine whether a level has been completed or not.
                            let currentLevelNum;
                            if (this.nextLevel) {
                                currentLevelNum = (parseInt(this.nextLevel.name.split("Level")[1]) - 1);
                            }
                            else {
                                // this is the last level
                                currentLevelNum = 6;
                            }
                            console.log("Completed Level" + currentLevelNum + " with " + this.elapsedTime + " seconds.");
                            let currentBest = localStorage.getItem("level" + currentLevelNum + "_best");
                            if (currentBest) {
                                if (currentBest > this.elapsedTime.toString()) {
                                    localStorage.setItem("level" + currentLevelNum + "_best", this.elapsedTime.toString());
                                    console.log("New best time!");
                                }
                            }
                            else {
                                // best by default
                                localStorage.setItem("level" + currentLevelNum + "_best", this.elapsedTime.toString());
                                console.log("First clear!");
                            }
                            
                            clearInterval(this.levelTimer);
                        }
                    }
                    break;

                case Lungo_Events.LEVEL_START:
                    {
                        // Re-enable controls
                        Input.enableInput();
                    }
                    break;
                
                case Lungo_Events.LEVEL_END:
                    {
                        // Go to the next level
                        if(this.nextLevel){
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
                            this.sceneManager.changeToScene(this.nextLevel, {}, sceneOptions);
                        }
                        else {
                            // last level, go to main menu
                            this.respawnPlayer();
                        }
                    }
                    break;
                case Lungo_Events.PLAYER_KILLED:
                    {
                        this.respawnPlayer();
                    }
                    break;

                case Lungo_Events.ENEMY_DAMAGED:
                     {
                        //console.log("enemy balloon collision!")
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));
                        if(node === undefined || node === null) return; 
                        if(other === undefined || other === null) return;  //crash fix after enemy died                      
                       
                        if(node.ai instanceof BasicEnemyController ){
                            // Node is player, other is balloon
                            //console.log("enemy is first node")
                            this.handleEnemyBalloonCollision(<AnimatedSprite>node, <AnimatedSprite>other);
                        } else {
                            //console.log("enemy is second node")
                            // Other is player, node is balloon
                            this.handleEnemyBalloonCollision(<AnimatedSprite>other,<AnimatedSprite>node);

                        }
                     }
                    break;
                case Lungo_Events.ENEMY_KILLED:
                    {
                        console.log("enemy dieded :(")
                        let node = this.sceneGraph.getNode(event.data.get("owner"));
                        if(node) //node would be null if the bullet collided with player (ig since lungo counts as a wall to the engine? (check bulletAI for bullet destruction implementation))
                            node.destroy();
                    }
                       break;
                case Lungo_Events.ENEMY_FIRES:
                    {
                        let selfPos = event.data.get("selfPos");
                        let enemyPos = event.data.get("enemyPos");
                        let startSpeed = event.data.get("startSpeed");
                        let weight = event.data.get("weight");
                        this.addProjectile("blue", selfPos, {enemyPos: enemyPos, startSpeed: startSpeed, weight: weight});
                    }
                    break;
            }
        }

        //Update our shield state by firing the event
        //See main.ts for the controls
        if(this.shieldWallTimer.isStopped()){
            if(Input.isPressed("shield wall") || Input.isMouseJustPressed(2)){
                this.shieldJump = false;
                this.emitter.fireEvent(Lungo_Events.SHIELD_WALL);
                this.shieldWallTimer.start();
                return;
            }
        }
        if(this.shieldTrampolineTimer.isStopped()){
            if(Input.isPressed("shield trampoline") || Input.isMouseJustPressed(0)){
                this.emitter.fireEvent(Lungo_Events.SHIELD_TRAMPOLINE);
                this.shieldTrampolineTimer.start();
                this.shieldJump = true;
                return;
            }
        }
        if(this.invincibleTimer.isStopped()){
            if(Input.isPressed("invincible")){
                console.log("Player is now: " + (this.invincible ? "NOT invincible" : "invincible"));
                this.invincible = !this.invincible;
                this.invincibleTimer.start();
                return;
            }
        }

    }

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.addUILayer("UI");

        // Add a layer for players and enemies
        this.addLayer("primary", 1);
    }

    /**
     * Initializes the viewport
     */
    protected initViewport(): void {
        this.viewport.setZoomLevel(2);
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(){
        this.receiver.subscribe([
            Lungo_Events.PLAYER_HIT_SWITCH,
            Lungo_Events.PLAYER_HIT_BALLOON,
            Lungo_Events.BALLOON_POPPED,
            Lungo_Events.PLAYER_ENTERED_LEVEL_END,
            Lungo_Events.LEVEL_START,
            Lungo_Events.LEVEL_END,
            Lungo_Events.PLAYER_KILLED,
            Lungo_Events.ENEMY_KILLED,
            Lungo_Events.SHIELD_HIT,
            Lungo_Events.SHIELD_TRAMPOLINE_JUMP,
            Lungo_Events.ENEMY_FIRES,
            Lungo_Events.ENEMY_DAMAGED
        ]);
    }

    /**
     * Adds in any necessary UI to the game
     */
    protected addUI(){

        // In-game labels
        this.bestTime = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(500, 30), text: "Current Best Time: N/A"});
        this.bestTime.textColor = Color.BLACK
        this.bestTime.font = "PixelSimple";

        this.timeLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(500, 50), text: "Time Elapsed: " + this.elapsedTime / 60 + ":" + this.elapsedTime % 60});
        this.timeLabel.textColor = Color.BLACK;
        this.timeLabel.font = "PixelSimple";

  

        this.levelLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(50, 30), text:"Level: "});
        this.levelLabel.textColor = Color.BLACK;
        this.levelLabel.font = "PixelSimple";

        this.livesCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(50, 50), text: "Lives: " + GameLevel.livesCount});
        this.livesCountLabel.textColor = Color.BLACK;
        this.livesCountLabel.font = "PixelSimple";

        // TODO - fix this
        /*
        this.enemyLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(50, 70), text: "Enemies Left: "});


        this.enemyLabel.textColor = Color.BLACK;
        this.enemyLabel.font = "PixelSimple";
        */
       
        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(-300, 200), text: "Level Complete"});
        this.levelEndLabel.size.set(1200, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";
        

        const center = new Vec2(290, 350);


        // Pause Menu
        this.pauseMenu = this.addUILayer("pause");
        this.pauseMenu.setHidden(true);

        const title = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(center.x, center.y - 200), text: "Paused"});
        title.font = "Verdana";
        title.backgroundColor = Color.ORANGE;
        title.borderColor = Color.WHITE;
        title.borderRadius = 0;
        title.textColor = Color.YELLOW;
        title.alpha = 0.2;
        title.fontSize = 120;

        // Add resume button, and give it an event to emit on press
        const resumeButton = <Button>this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(center.x, center.y - 125), text: "Resume"});
        resumeButton.backgroundColor = Color.ORANGE;
        resumeButton.borderColor = Color.WHITE;
        resumeButton.borderRadius = 0;
        resumeButton.setPadding(new Vec2(50, 10));
        resumeButton.font = "PixelSimple";
        resumeButton.textColor = Color.YELLOW;
        resumeButton.onClick = () => {
            console.log("un-paused");

            if (!this.pauseMenu.isHidden()) {
                this.pauseMenu.setHidden(true);
            }
            this.enemyList.forEach((enemy) => {
                enemy.unfreeze();
                enemy.enablePhysics();
                enemy.aiActive = true;
            });

            this.projectileList.forEach((projectile) => {
                projectile.unfreeze();
                projectile.enablePhysics(); 
                projectile.aiActive = true;
            });

            this.shield.unfreeze();
            this.shield.enablePhysics();
            this.shield.aiActive = true;

            this.player.unfreeze();
            this.player.enablePhysics();
            this.player.aiActive = true;

            this.isPaused = false;
        }


         // Add resume button, and give it an event to emit on press
         const returnToMainMenuButton = <Button>this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(center.x, center.y - 75), text: "Return to Main Menu"});
         returnToMainMenuButton.backgroundColor = Color.ORANGE;
         returnToMainMenuButton.borderColor = Color.WHITE;
         returnToMainMenuButton.borderRadius = 0;
         returnToMainMenuButton.setPadding(new Vec2(50, 10));
         returnToMainMenuButton.font = "PixelSimple";
         returnToMainMenuButton.textColor = Color.YELLOW;
         returnToMainMenuButton.onClick = () => {
            console.log("returning to main menu");
            clearInterval(this.levelTimer);
            if (!this.pauseMenu.isHidden()) {
                this.pauseMenu.setHidden(true);
            }
            this.viewport.setZoomLevel(1);
            this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
            this.sceneManager.changeToScene(MainMenu, {});
         }

        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -300,
                    end: 300,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        // Create our particle system and initialize the pool
        this.system = new Lungo_ParticleSystem(100, new Vec2((5 * 32), (10 * 32)), 2000, 3, 1, 100);
        this.system.initializePool(this, "primary");

        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(300, 200), size: new Vec2(600, 400)});
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;

        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: Lungo_Events.LEVEL_END
        });

        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: Lungo_Events.LEVEL_START
        });
    }

    /**
     * Initializes the player
     */
    protected initPlayer(): void {
        // Add the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.scale.set(2, 2);
        if(!this.playerSpawn){
            console.warn("Player spawn was never set - setting spawn to (0, 0)");
            this.playerSpawn = Vec2.ZERO;
        }
        this.player.position.copy(this.playerSpawn);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 14)));
        this.player.colliderOffset.set(0, 2);
        this.player.addAI(PlayerController, {playerType: "platformer", tilemap: "Main", color: Lungo_Color.RED});

        this.player.setGroup("player");

        this.player.setTrigger("projectile", Lungo_Events.PLAYER_HIT_BALLOON, null);

        this.viewport.follow(this.player);
    }

        /**
     * Initializes the shield
     */
        protected initShield(): void {
        // Add the shield
        this.shield = this.add.animatedSprite("shield", "primary");
        this.shield.scale.set(2, 2);
        if(!this.shieldSpawn){
            console.warn("Shield spawn was never set - setting spawn to (0, 0)");
            this.shieldSpawn = Vec2.ZERO;
        }
        this.shield.position.copy(this.shieldSpawn);
        this.shield.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 14)));
        this.shield.colliderOffset.set(0, 2);
        this.shield.addAI(ShieldController, {playerType: "platformer", tilemap: "Main", player: this.player});

        this.shield.setGroup("shield");
        this.shield.setTrigger("balloon", Lungo_Events.SHIELD_HIT, null);
        this.shield.setTrigger("projectile", Lungo_Events.SHIELD_HIT, null);
        this.shield.setTrigger("player", Lungo_Events.SHIELD_TRAMPOLINE_JUMP, null);
    }

    /**
     * Initializes the level end area
     */
    protected addLevelEnd(startingTile: Vec2, size: Vec2): void {
        //console.log(startingTile);
        //console.log(size);
        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, "primary", {position: startingTile.scale(32), size: size.scale(32)});
        this.levelEndArea.addPhysics(undefined, undefined, false, true);
        this.levelEndArea.setTrigger("player", Lungo_Events.PLAYER_ENTERED_LEVEL_END, null);
        this.levelEndArea.color = new Color(0, 0, 0, 0);
    }

    // HOMEWORK 5 - TODO
    /*
        Make sure balloons are being set up properly to have triggers so that when they collide
        with players, they send out a trigger event.

        Look at the levelEndArea trigger for reference.
    */
    /**
     * Adds an balloon into the game
     * @param spriteKey The key of the balloon sprite
     * @param tilePos The tilemap position to add the balloon to
     * @param aiOptions The options for the balloon AI
     */
    protected addBalloon(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let balloon = this.add.animatedSprite(spriteKey, "primary");
        balloon.position.set(tilePos.x*32, tilePos.y*32);
        balloon.scale.set(2, 2);
        balloon.addPhysics();
        balloon.addAI(BalloonController, aiOptions);
        balloon.setGroup("balloon");
        balloon.setTrigger("player", Lungo_Events.PLAYER_HIT_BALLOON, null);

        this.projectileList.push(balloon);
    }

    protected addEnemy(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(tilePos.x*32, tilePos.y*32);
        enemy.scale.set(2, 2);
        enemy.addPhysics();
        enemy.unfreeze();
        enemy.addAI(BasicEnemyController, aiOptions);
        enemy.setGroup("enemy");

        this.enemyList.push(enemy);
    }

    protected addProjectile(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        console.log("Adding projectile!");
        let projectile = this.add.animatedSprite(spriteKey, "primary");
        projectile.position.set(tilePos.x, tilePos.y); // we don't multiply by 32 because the given pos is already scaled properly.
        projectile.scale.set(2, 2);
        projectile.addPhysics();
        projectile.unfreeze();
        projectile.addAI(BulletBehavior, aiOptions);
        projectile.setGroup("projectile");
        projectile.setTrigger("player", Lungo_Events.PLAYER_HIT_BALLOON, null);
        projectile.setTrigger("enemy", Lungo_Events.ENEMY_DAMAGED, null  ); //not sure if right, pops balloon then damages enemy


        this.projectileList.push(projectile);
    }

    protected handlePlayerBalloonCollision(player: AnimatedSprite, balloon: AnimatedSprite) {
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pop", loop: false, holdReference: false});
        if(player === undefined || player === null) return;
        if(balloon === undefined || balloon === null) return;
        let pc = <PlayerController>player._ai;
        let bc = <BalloonController>balloon._ai;

        
        if(!this.invincible){
            console.log("Decreasing life count!", GameLevel.livesCount - 1);
            this.incPlayerLife(-1);
        }

        //Pop the balloon
        this.emitter.fireEvent(Lungo_Events.BALLOON_POPPED, {owner: balloon.id}); 
    }

    protected handleEnemyBalloonCollision(enemy: AnimatedSprite, balloon: AnimatedSprite) {
        
        if(enemy === undefined || enemy === null) return;
        if(balloon === undefined || balloon === null) return;
        let ec = <BasicEnemyController>enemy._ai;
        let bc = <BulletBehavior>balloon._ai;
        //console.log("enemy: ouch!")
        //console.log("is balloon reversed: ",bc.reversed)
        //only pop a projectile if it's reversed, so enemies don't kill themselves
        if(bc.reversed){
            console.log("Decreasing enemy life count!", ec.health-1);
            ec.health -= 1;
            //this.incPlayerLife(-1); where we would decrease enemy life
            //if enemy life <= 0, kill enemy
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pop", loop: false, holdReference: false});
            // kill enemy and pop balloon
            if(ec.health <= 0){
                this.emitter.fireEvent(Lungo_Events.ENEMY_KILLED, {owner: enemy.id});
                this.emitter.fireEvent(Lungo_Events.BALLOON_POPPED, {owner: balloon.id}); 
            }
            // enemny lives, just Pop the balloon
            else{
                
                this.emitter.fireEvent(Lungo_Events.BALLOON_POPPED, {owner: balloon.id}); 
            }
    

        }

 
    }

    protected handleShieldBalloonCollision(shield: AnimatedSprite, balloon: AnimatedSprite) {
        if (balloon === undefined) {
            return;
        }
        //console.log("is this a bullet?: ",balloon.ai instanceof BulletAI)
        
        let balloonAI = null;

        if(balloon.ai instanceof BalloonController){
            balloonAI = <BalloonController>balloon.ai;
        }
        else{
            balloonAI = <BulletBehavior>balloon.ai
        }
        if (balloonAI === undefined) {
            return;
        }
        if (balloonAI.reversed === true) {
            return;
        }
        
        shield.animation.playIfNotAlready("REFLECT", false, "IDLE");
        console.log("balloon reversed");
        balloonAI.reversed = true;
        let oldDirection = balloonAI.direction;
        balloonAI.direction = new Vec2(oldDirection.x * -1, oldDirection.y * -1);
        let oldVelocity = balloonAI.velocity;
        balloonAI.velocity = new Vec2(oldVelocity.x * -1, oldVelocity.y * -1);
    }

    //This might be incorrect, since we're not account for deltaT, but I think it should be fine
    // Unless the player is extremely laggy.
    protected handlePlayerShieldTrampolineJump(player: AnimatedSprite, shield: AnimatedSprite) {
        if(!this.shieldJump){
            return;
        }
        else{
            this.shieldJump = false;
        }
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pop", loop: false, holdReference: false});
        if(player === undefined || player === null) return;
        let playerAI = <PlayerController>player.ai;
        let shieldAI = <PlayerController>shield.ai;

        console.log(shieldAI);
        if (playerAI === undefined || shieldAI === undefined) {
            return;
        }
        playerAI.velocity = new Vec2(playerAI.velocity.x, -600);
        //This will revert us back to the idle state
        this.emitter.fireEvent(Lungo_Events.SHIELD_TRAMPOLINE); 

    }
    

    /**
     * Increments the amount of life the player has
     * @param amt The amount to add to the player life
     */
    protected incPlayerLife(amt: number): void {
        

        GameLevel.livesCount += amt;
        this.livesCountLabel.text = "Lives: " + GameLevel.livesCount;
        if (GameLevel.livesCount == 0){
            Input.disableInput();
            this.player.disablePhysics();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
            this.player.tweens.play("death");
        }
    }

    //handles removal of bullets from projectile list
    handleScreenDespawn(node: CanvasNode, viewportCenter: Vec2, baseViewportSize: Vec2): void {
		// Your code goes here:
		// Plan: Check left, right, top, and bottom (or take a look at the shape overlap function for inspiration)
		// Check for isBullet
			if(node.position.y < 0 || node.position.x < (viewportCenter.x - baseViewportSize.x) || node.position.x >(viewportCenter.x + baseViewportSize.x) ){

                if(node.ai instanceof BulletBehavior){
                    this.emitter.fireEvent(Lungo_Events.BALLOON_POPPED, {owner: node.id});
                    console.log("bullet despawned!!!")
                    //console.log((viewportCenter.x - baseViewportSize.x),(viewportCenter.x + baseViewportSize.x),node.position.y )


                }
			
		}

	}



    /**
     * Returns the player to spawn
     */
     protected respawnPlayer(): void {
        clearInterval(this.levelTimer);
        this.viewport.setZoomLevel(1);
        GameLevel.livesCount = 10;
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.sceneManager.changeToScene(MainMenu, {});
        Input.enableInput();
        this.system.stopSystem();
    }
}