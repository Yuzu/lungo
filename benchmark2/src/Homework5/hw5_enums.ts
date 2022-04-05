export enum HW5_Events {
    PLAYER_MOVE = "PlayerMove",
    PLAYER_JUMP = "PlayerJump",
    PLAYER_HIT_SWITCH = "PlayerHitSwitch",
    PLAYER_HIT_BALLOON = "PlayerHitEBalloon",
    BALLOON_POPPED = "BalloonPopped",
    PLAYER_ENTERED_LEVEL_END = "PlayerEnteredLevelEnd",
    LEVEL_START = "LevelStart",
    LEVEL_END = "LevelEnd",
    PLAYER_KILLED = "PlayerKilled",
    SUIT_COLOR_CHANGE = "SuitColorChange",
    SHIELD_HIT = "ShieldHit",
    SHIELD_WALL = "ShieldWall", //Must be the same as ShieldController.states.

    ENEMY_DAMAGED = "EnemyDamaged",
    ENEMY_KILLED = "EnemyKilled",
    ENEMY_AGGROS = "EnemyAggros",
    ENEMY_RESETS_AGGRO = "EnemyResetsAggro",
    ENEMY_FIRES = "EnemyFires"
    SHIELD_TRAMPOLINE = "ShieldTrampoline",
    SHIELD_TRAMPOLINE_JUMP = "ShieldTrampolineJump"
}