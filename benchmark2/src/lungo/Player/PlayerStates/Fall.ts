import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Lungo_Color } from "../../Lungo_color";
import InAir from "./InAir";

export default class Fall extends InAir {
    owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.owner.animation.playIfNotAlready("FALL", true);
	}

    onExit(): Record<string, any> {
		this.owner.animation.stop();
        return {};
    }
}