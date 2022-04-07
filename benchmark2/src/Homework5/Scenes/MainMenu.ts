import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Level1 from "./Level1";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import EaseFunctions, { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import Input from "../../Wolfie2D/Input/Input";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private splashScreen: Layer;
    private mainMenu: Layer;
    private levelSelect: Layer;
    private help: Layer;
    private controls: Layer;

    private tweenInterval: any;

    animatedSprite: AnimatedSprite;
    
    loadScene(): void {
        // Load the menu song
        this.load.audio("menu", "hw5_assets/music/menu.mp3");

        this.load.image("background", "./hw5_assets/images/Lungo.png");
    }

    startScene(){
        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        const center = this.viewport.getCenter();

        this.splashScreen = this.addUILayer("splashScreen");
        this.addParallaxLayer("bg", new Vec2(0.5, 1), -1);
        let bg = this.add.sprite("background", "splashScreen");
        bg.position.set(center.x, center.y);
        
        const prompt = <Label>this.add.uiElement(UIElementType.LABEL, "splashScreen", {position: new Vec2(center.x, center.y+300), text: "Click Anywhere To Continue"});
        prompt.font = "Verdana";
        prompt.textColor = Color.WHITE;
        prompt.fontSize = 65;

        prompt.tweens.add("pulseBig", {
            startDelay: 0,
            duration: 2500,
            effects: [
                {
                    property: "fontSize",
                    start: 65,
                    end: 75,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

        prompt.tweens.add("pulseSmall", {
            startDelay: 2500,
            duration: 2500,
            effects: [
                {
                    property: "fontSize",
                    start: 75,
                    end: 65,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        })

        prompt.tweens.play("pulseBig");
        prompt.tweens.play("pulseSmall");

        this.tweenInterval = setInterval(() => {
            prompt.tweens.play("pulseBig");
            prompt.tweens.play("pulseSmall");
        }, 5000);


        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");
        this.mainMenu.setHidden(true);

        const title = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y - 300), text: "Lungo"});
        title.font = "Verdana";
        title.textColor = Color.WHITE;
        title.fontSize = 120;

        const subtitle = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y - 200), text: "Main Menu"});
        subtitle.font = "Verdana";
        subtitle.textColor = Color.WHITE;
        subtitle.fontSize = 30;

        // Add play button, and give it an event to emit on press
        const playButton = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 100), text: "Play"});
        playButton.backgroundColor = Color.ORANGE;
        playButton.borderColor = Color.WHITE;
        playButton.borderRadius = 0;
        playButton.setPadding(new Vec2(50, 10));
        playButton.font = "PixelSimple";
        playButton.textColor = Color.YELLOW;
        playButton.onClickEventId = "levelSelect";

        // Add controls button
        const controlsButton = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y), text: "Controls"});
        controlsButton.backgroundColor = Color.ORANGE;
        controlsButton.borderColor = Color.WHITE;
        controlsButton.borderRadius = 0;
        controlsButton.setPadding(new Vec2(50, 10));
        controlsButton.font = "PixelSimple";
        controlsButton.textColor = Color.YELLOW;
        controlsButton.onClickEventId = "controls";

        // Add help button
        const helpButton = <Button>this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 100), text: "Help"});
        helpButton.backgroundColor = Color.ORANGE;
        helpButton.borderColor = Color.WHITE;
        helpButton.borderRadius = 0;
        helpButton.setPadding(new Vec2(50, 10));
        helpButton.font = "PixelSimple";
        helpButton.textColor = Color.YELLOW;
        helpButton.onClickEventId = "help";

        // Subscribe to the button events
        this.receiver.subscribe("levelSelect");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("help");
        this.receiver.subscribe("menu");
        this.receiver.subscribe("play1");
        this.receiver.subscribe("play2");
        this.receiver.subscribe("play3");
        this.receiver.subscribe("play4");
        this.receiver.subscribe("play5");
        this.receiver.subscribe("play6");

        // Add controls layer
        this.controls = this.addUILayer("controls");
        this.controls.setHidden(true);
        const header = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 300), text: "Controls"});
        header.textColor = Color.WHITE;
        header.fontSize = 45;

        const left = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 200), text: "A: Move Left"});
        left.textColor = Color.WHITE;

        const right = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 150), text: "D: Move Right"});
        right.textColor = Color.WHITE;
 
        const jump = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y -100), text: "Space: Jump"});
        jump.textColor = Color.WHITE;
 
        const mouse = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y -50), text: "Mouse: Moves the shield in the direction of the mouse"});
        mouse.textColor = Color.WHITE;
 
        const pause = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y), text: "ESC: Pauses the game"});
        pause.textColor = Color.WHITE;

        const controlBackButton = <Button>this.add.uiElement(UIElementType.BUTTON, "controls", {position: new Vec2(center.x, center.y + 250), text: "Main Menu"});
        controlBackButton.backgroundColor = Color.ORANGE;
        controlBackButton.borderColor = Color.WHITE;
        controlBackButton.borderRadius = 0;
        controlBackButton.setPadding(new Vec2(50, 10));
        controlBackButton.font = "PixelSimple";
        controlBackButton.textColor = Color.YELLOW;
        controlBackButton.onClickEventId = "menu";


        // Add help layer
        this.help = this.addUILayer("help");
        this.help.setHidden(true);

        const helpHeader = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 250), text: "Help"});
        helpHeader.textColor = Color.WHITE;

        const text1 = "Made by Gabriello, Max, and Tim";

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x - 350, center.y - 350), text: text1});
        line1.textColor = Color.WHITE;

        const text2 = `Lungo, a pacifist born into a bloody and ruthless world, struggles to find himself as those around him are concerned with being the strongest.`;
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 200), text: text2});
        line2.textColor = Color.WHITE;
        line2.fontSize = 16;

        const text3 = `The continent's beauty, Lorissa, takes notice of Lungo and marries him for his kind and unique nature. The chieftain of his village, Fred, detests Lungo for this. `;
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 175), text: text3});
        line3.textColor = Color.WHITE;
        line3.fontSize = 16;

        const text4 = `Fred orders his goons to kidnap Lorissa. To save his wife, Lungo must defeat the various obstacles set out by Fred…`;
        const line4 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 150), text: text4});
        line4.textColor = Color.WHITE;
        line4.fontSize = 16;

        const text5 = `But the more Lungo progresses, the more he loses his convictions.`;
        const line5 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 125), text: text5});
        line5.textColor = Color.WHITE;
        line5.fontSize = 16;
        
        const text6 = `Lungo: Protagonist. Must save his wife.`;
        const line6 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 75), text: text6});
        line6.textColor = Color.WHITE;
        line6.fontSize = 16;

        const text7 = `Lorissa: Lungo’s wife, kidnapped by Fred.`;
        const line7 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 50), text: text7});
        line7.textColor = Color.WHITE;
        line7.fontSize = 16;

        const text8 = `Fred: Local chieftan. Hates Lungo. Stole Lorissa.`;
        const line8 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 25), text: text8});
        line8.textColor = Color.WHITE;
        line8.fontSize = 16;

        const text9 = `Ctrl+x+y+z = Unlocks all levels.`;
        const line9 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y +25), text: text9});
        line9.textColor = Color.WHITE;
        line9.fontSize = 16;

        const text10 = `Ctrl+g+o+d = Makes Lungo Invincible.`;
        const line10 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 50), text: text10});
        line10.textColor = Color.WHITE;
        line10.fontSize = 16;

        const text11 = `Ctrl+b = Shows hit boxes (tilemap, enemies, etc).`;
        const line11 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 75), text: text11});
        line11.textColor = Color.WHITE;
        line11.fontSize = 16;

        const helpBack = this.add.uiElement(UIElementType.BUTTON, "help", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        helpBack.size.set(200, 50);
        helpBack.borderWidth = 2;
        helpBack.borderColor = Color.WHITE;
        helpBack.backgroundColor = Color.TRANSPARENT;
        helpBack.onClickEventId = "menu";

        
        // Add level select screen
        this.levelSelect = this.addUILayer("levelSelect");
        this.levelSelect.setHidden(true);
        const levelSelectHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x, center.y - 300), text: "Level Selection"});
        levelSelectHeader.textColor = Color.WHITE;
        levelSelectHeader.fontSize = 45;

        // TODO - disable clickable buttons depending on player progress. We can prob just keep this in local storage or smth

        const play1 = <Button>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x - 400, center.y - 150), text: "     "});
        play1.size = new Vec2(75, 75);
        play1.backgroundColor = Color.GREEN; // TODO - conditional rendering
        play1.onClickEventId = "play1"; // TODO - conditional event emitting based on unlocks
        const label1 = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x - 400, center.y - 75), text: "Level 1"});
        label1.textColor = Color.WHITE;
        

        const play2 = <Button>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x, center.y - 150), text: "     "});
        play2.size = new Vec2(75, 75);
        play2.backgroundColor = Color.YELLOW; // TODO - conditional rendering
        play2.onClickEventId = "play2"; // TODO - conditional event emitting based on unlocks
        const label2 = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x, center.y - 75), text: "Level 2"});
        label2.textColor = Color.WHITE;


        const play3 = <Button>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x + 400, center.y - 150), text: "     "});
        play3.size = new Vec2(75, 75);
        play3.backgroundColor = Color.RED; // TODO - conditional rendering
        play3.onClickEventId = "play3"; // TODO - conditional event emitting based on unlocks
        const label3 = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x + 400, center.y - 75), text: "Level 3"});
        label3.textColor = Color.WHITE;




        const play4 = <Button>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x - 400, center.y + 75), text: "     "});
        play4.size = new Vec2(75, 75);
        play4.backgroundColor = Color.RED; // TODO - conditional rendering
        play4.onClickEventId = "play4"; // TODO - conditional event emitting based on unlocks
        const label4 = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x - 400, center.y +150), text: "Level 4"});
        label4.textColor = Color.WHITE;

        const play5 = <Button>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x, center.y + 75), text: "     "});
        play5.size = new Vec2(75, 75);
        play5.backgroundColor = Color.RED; // TODO - conditional rendering
        play5.onClickEventId = "play5"; // TODO - conditional event emitting based on unlocks
        const label5 = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x, center.y +150), text: "Level 5"});
        label5.textColor = Color.WHITE;

        const play6 = <Button>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x + 400, center.y + 75), text: "     "});
        play6.size = new Vec2(75, 75);
        play6.backgroundColor = Color.RED; // TODO - conditional rendering
        play6.onClickEventId = "play4"; // TODO - conditional event emitting based on unlocks
        const label6 = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {position: new Vec2(center.x + 400, center.y +150), text: "Level 6"});
        label6.textColor = Color.WHITE;


        const levelSelectBack = <Button>this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x, center.y + 250), text: "Main Menu"});
        levelSelectBack.backgroundColor = Color.ORANGE;
        levelSelectBack.borderColor = Color.WHITE;
        levelSelectBack.borderRadius = 0;
        levelSelectBack.setPadding(new Vec2(50, 10));
        levelSelectBack.font = "PixelSimple";
        levelSelectBack.textColor = Color.YELLOW;
        levelSelectBack.onClickEventId = "menu";
    }

    
    updateScene(){
        if (Input.isMouseJustPressed() && !this.splashScreen.isHidden()) {
            this.splashScreen.setHidden(true);
            this.mainMenu.setHidden(false);
            clearInterval(this.tweenInterval);
        }
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "levelSelect"){
                this.mainMenu.setHidden(true);
                this.levelSelect.setHidden(false);
            }


            // TODO - disable clickable buttons above depending on player progress
            if (event.type === "play1") {
                console.log("play 1");
                /*
                Init the next scene with physics collisions:
                        ground  player  balloon, shield
                ground    No      --      --     No
                player    Yes      No      --    Yes
                balloon   Yes      No      No    No
                shield    No      Yes      No    No
                Each layer becomes a number. In this case, 4 bits matter for each
                ground:  self - 000, collisions - 011
                player:  self - 001, collisions - 100
                balloon: self - 010, collisions - 000
                */

                let sceneOptions = {
                    physics: {
                        groupNames: ["ground", "player", "balloon", "shield", "enemy"],
                        collisions:
                        [
                            [0, 1, 1, 0, 1],
                            [1, 0, 0, 1, 1],
                            [1, 0, 0, 0, 0],
                            [0, 1, 0, 0, 0],
                            [1, 1, 0, 0, 1]
                        ]
                    }
                }
                this.sceneManager.changeToScene(Level1, {}, sceneOptions);

                // Scene has started, so start playing music
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
            }
            if (event.type === "play2") {
                console.log("play 2");
            }
            if (event.type === "play3") {
                console.log("play 3");
            }
            if (event.type === "play4") {
                console.log("play 4");
            }
            if (event.type === "play5") {
                console.log("play 5");
            }
            if (event.type === "play6") {
                console.log("play 6");
            }

            if(event.type === "help"){
                this.help.setHidden(false);
                this.mainMenu.setHidden(true);
            }

            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.help.setHidden(true);
                this.controls.setHidden(true);
                this.levelSelect.setHidden(true);
            }
            if(event.type === "controls"){
                this.mainMenu.setHidden(true);
                this.controls.setHidden(false);
            }

        }
    }

    
    unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu"});
    }
}