import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Level1 from "./Level1";

export default class MainMenu extends Scene {

    animatedSprite: AnimatedSprite;

    loadScene(): void {
        // Load the menu song
        this.load.audio("menu", "hw5_assets/music/menu.mp3");
    }

    startScene(): void {
        this.addUILayer("Main");

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        // Create a play button
        let playBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y), text: "Play Game"});
        playBtn.backgroundColor = Color.ORANGE;
        playBtn.borderColor = Color.WHITE;
        playBtn.borderRadius = 0;
        playBtn.setPadding(new Vec2(50, 10));
        playBtn.font = "PixelSimple";
        playBtn.textColor = Color.YELLOW;

        //Create a controls button
        let controlsBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 100), text: "Controls"});
        controlsBtn.backgroundColor = Color.ORANGE;
        controlsBtn.borderColor = Color.WHITE;
        controlsBtn.borderRadius = 0;
        controlsBtn.setPadding(new Vec2(50, 10));
        controlsBtn.font = "PixelSimple";
        controlsBtn.textColor = Color.YELLOW;

        //Create a help button
        let helpBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 200), text: "Help"});
        helpBtn.backgroundColor = Color.ORANGE;
        helpBtn.borderColor = Color.WHITE;
        helpBtn.borderRadius = 0;
        helpBtn.setPadding(new Vec2(50, 10));
        helpBtn.font = "PixelSimple";
        helpBtn.textColor = Color.YELLOW;


        // When the play button is clicked, go to the next scene
        playBtn.onClick = () => {
            /*
                Init the next scene with physics collisions:

                          ground  player  balloon shield
                ground    No      --      -- 
                player    Yes      No      --  
                balloon   Yes      No      No  
                shield    No       No      Yes

                Each layer becomes a number. In this case, 4 bits matter for each

                ground:  self - 000, collisions - 011
                player:  self - 001, collisions - 100
                balloon: self - 010, collisions - 000
            */

                let sceneOptions = {
                    physics: {
                        groupNames: ["ground", "player", "balloon", "shield"],
                        collisions:
                        [
                            [0, 1, 1, 0],
                            [1, 0, 0, 0],
                            [1, 0, 0, 0],
                            [0, 0, 0, 0]
                        ]
                    }
                }
            this.sceneManager.changeToScene(Level1, {}, sceneOptions);
        }

        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
    }

    unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu"});
    }
}

