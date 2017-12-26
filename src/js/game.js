import * as PIXI from 'pixi.js';
import pixiTiled from 'pixi-tiledmap';
import Socket from './network.js';
import NetworkKeyboard from './networkKeyboard.js';

import Player from './player.js';

export default class Game {
    init(app) {
        //Connect to the websockets
        this.socket = new Socket("Matt");

        //Create the tilemap
        this.tileMap = new PIXI.extras.TiledMap("src/maps/test-map.tmx");
        app.stage.addChild(this.tileMap);

        //Create the player
        this.player = new Player(PIXI.loader.resources["src/textures/cat.png"].texture);
        this.tileMap.addChild(this.player);

        this.socket.connected = () => this.keyboard = new NetworkKeyboard(this.socket);

        this.socket.onmessage = (payload) => {
            let pos = payload;
            this.player.x = pos.x;
            this.player.y = pos.y;
        };
    }

    update(delta) {
        this.player.update(delta, this.tileMap);

        if (this.keyboard)
            this.keyboard.update();
    }
}