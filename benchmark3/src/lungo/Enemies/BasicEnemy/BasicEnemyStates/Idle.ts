import Input from "../../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { BasicEnemyStates } from "../BasicEnemyController";
import BasicEnemyState from "./BasicEnemyState";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { Lungo_Events } from "../../../Lungo_enums";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";

export default class Idle extends BasicEnemyState {
    owner: AnimatedSprite;

    onEnter(options: Record<string, any>): void {}

	update(deltaT: number): void {
		super.update(deltaT);
        
        this.parent.velocity.x = 0;

		this.owner.move(this.parent.velocity.scaled(deltaT));
        if (!this.owner.animation.isPlaying("ATTACK")) {
            this.owner.animation.playIfNotAlready("IDLE", true);
        }
	}

    handleInput(event: GameEvent): void {
        
        if (event.type == Lungo_Events.PLAYER_MOVE) {
            // Determine if the enemy has a line of sight to the player, and if so, start shooting.
            let selfPos = this.owner.position;
            let enemyPos = event.data.get("position");

            
            //If they're too far away, abort this to save processing power
            let d = (selfPos.x - enemyPos.x) * (selfPos.x - enemyPos.x) + (selfPos.y - enemyPos.y) * (selfPos.y - enemyPos.y);
            
            //MAYBE SWITCH THIS TO AN ENEMY RANGE VALUE?
            if(Math.sqrt(d) > 350){
                return;
            }

            let enemyPosCopy = new Vec2(enemyPos.x, enemyPos.y);
            let selfPosCopy = new Vec2(selfPos.x, selfPos.y);

            let delta = enemyPosCopy.sub(selfPosCopy); // fuck this bug why is this engine like this

            // Iterate through the tilemap region until we find a collision
            let minX = Math.min(selfPosCopy.x, enemyPosCopy.x);
            let maxX = Math.max(selfPosCopy.x, enemyPosCopy.x);
            let minY = Math.min(selfPosCopy.y, enemyPosCopy.y);
            let maxY = Math.max(selfPosCopy.y, enemyPosCopy.y);

            // Get the wall tilemap
            let walls = <OrthogonalTilemap>this.owner.getScene().getLayer("Walls").getItems()[0];

            let minIndex = walls.getColRowAt(new Vec2(minX, minY));
            let maxIndex = walls.getColRowAt(new Vec2(maxX, maxY));

            
            let tileSize = walls.getTileSize();
            for (let col = minIndex.x; col <= maxIndex.x; col++) {
                for (let row = minIndex.y; row <= maxIndex.y; row++) {
                    if (walls.isTileCollidable(col, row)) {
                        // Get the position of this tile
                        let tilePos = new Vec2(col * tileSize.x + tileSize.x / 2, row * tileSize.y + tileSize.y / 2);
    
                        // Create a collider for this tile
                        let collider = new AABB(tilePos, tileSize.scaled(1 / 2));
    
                        let hit = collider.intersectSegment(selfPosCopy, delta, Vec2.ZERO);
    
                        if (hit !== null && selfPosCopy.distanceSqTo(hit.pos) < selfPosCopy.distanceSqTo(enemyPosCopy)) {
                            // We hit a wall, we can't see the player
                            //console.log("I don't see you :(");
                            return;
                        }
                    }
                }
            }
            //console.log("updating", this.owner.position.x);
            //console.log("I SEE YOU");
            //console.log("I SEE YOU (in aggro)", this.canFire, selfPos.x);
            //change state to aggro state
            this.finished(BasicEnemyStates.AGGRO);
            //console.log(this.owner);


        }
	}


	onExit(): Record<string, any> {
		return {};
	}
}