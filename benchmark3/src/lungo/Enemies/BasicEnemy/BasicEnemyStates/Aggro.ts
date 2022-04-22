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
            //console.log("Player move received in aggro!");
            // Determine if the enemy has a line of sight to the player, and if so, start shooting.
            let selfPos = this.owner.position;
            let enemyPos = event.data.get("position");
            //console.log(selfPos)
            //console.log(enemyPos)

            let enemyPosCopy = new Vec2(enemyPos.x, enemyPos.y);
            let selfPosCopy = new Vec2(selfPos.x, selfPos.y);

            let delta = enemyPosCopy.sub(selfPosCopy);

            if (selfPosCopy.x/32 > enemyPosCopy.x) {
                // player is to our left
                //console.log("face left")
                this.owner.invertX = true;
              }
              else if (selfPosCopy.x/32 < enemyPosCopy.x) {
                // else assume to the right
                //console.log("face right")
                this.owner.invertX = false;

              }


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
                            console.log("I don't see you :( (in aggro)");
                            this.finished(BasicEnemyStates.IDLE);
                        }
                    }
                }
            }
            //console.log("I SEE YOU (in aggro)", this.canFire, selfPos.x);
            
            //check to see if the enemy is able to fire
            //console.log(this.firingTimer);
            if(this.canFire){
                
                // determine the velocity and direction this bullet needs to go to hit the player.
                //console.log(selfPos);
                this.emitter.fireEvent(Lungo_Events.ENEMY_FIRES,
                                    {
                                    selfPos: new Vec2(selfPosCopy.x, selfPosCopy.y), 
                                    enemyPos: new Vec2(enemyPosCopy.x, enemyPosCopy.y),
                                    startSpeed: this.parent.projectileStartSpeed,
                                    weight: this.parent.projectileWeight
                                });
                
                console.log("pew pew");
                //console.log(this.gravity)
                this.canFire = false;
                this.firingTimer.start();
            }
            this.finished(BasicEnemyStates.IDLE);
            return;
        }
	}


	onExit(): Record<string, any> {
		return {};
	}
}