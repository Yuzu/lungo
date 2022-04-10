import Input from "../../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { BasicEnemyStates } from "../BasicEnemyController";
import BasicEnemyState from "./BasicEnemyState";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { Lungo_Events } from "../../../Lungo_enums";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";

export default class Aggro extends BasicEnemyState {
    owner: AnimatedSprite;

    onEnter(options: Record<string, any>): void {}

	update(deltaT: number): void {
		super.update(deltaT);

        this.parent.velocity.x = 0;

		this.owner.move(this.parent.velocity.scaled(deltaT));
        this.owner.animation.playIfNotAlready("IDLE", true);
	}

    handleInput(event: GameEvent): void {
        if (event.type == Lungo_Events.PLAYER_MOVE) {
            // Determine if the enemy has a line of sight to the player, and if so, start shooting.
            let selfPos = this.owner.position;
            let enemyPos = event.data.get("position");
            console.log(selfPos);
            let delta = enemyPos.sub(selfPos);

            // Iterate through the tilemap region until we find a collision
            let minX = Math.min(selfPos.x, enemyPos.x);
            let maxX = Math.max(selfPos.x, enemyPos.x);
            let minY = Math.min(selfPos.y, enemyPos.y);
            let maxY = Math.max(selfPos.y, enemyPos.y);

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
    
                        let hit = collider.intersectSegment(selfPos, delta, Vec2.ZERO);
    
                        if (hit !== null && selfPos.distanceSqTo(hit.pos) < selfPos.distanceSqTo(enemyPos)) {
                            // We hit a wall, we can't see the player
                            console.log("I don't see you :( (in aggro)");
                            this.finished(BasicEnemyStates.IDLE);
                        }
                    }
                }
            }
            console.log("I SEE YOU (in aggro)");
            
            //check to see if the enemy is able to fire
            //console.log(this.firingTimer);
            if(this.canFire){
                // determine the velocity and direction this bullet needs to go to hit the player.
                console.log(selfPos);
                this.emitter.fireEvent(Lungo_Events.ENEMY_FIRES,
                                    {
                                    selfPos: new Vec2(selfPos.x, selfPos.y), 
                                    enemyPos: new Vec2(enemyPos.x, enemyPos.y),
                                    startSpeed: this.parent.projectileStartSpeed,
                                    weight: this.parent.projectileWeight
                                });
                
                console.log("pew pew");
                this.canFire = false;
                this.firingTimer.start();
            }
            return;
        }
	}


	onExit(): Record<string, any> {
		return {};
	}
}