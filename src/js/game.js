import * as PIXI from 'pixi.js';
import pixiTiled from 'pixi-tiledmap';

import Player from './player.js';

let player, tileMap;

export default class Game {
    init(app) {
        //Create the tilemap
        tileMap = new PIXI.extras.TiledMap("src/maps/test-map.tmx");
        app.stage.addChild(tileMap);

        //Create the player
        player = new Player(PIXI.loader.resources["src/textures/cat.png"].texture);
        tileMap.addChild(player);
    }

    update(delta) {
        player.update(delta, tileMap);
    }
}