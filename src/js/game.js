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

        this.playerList = [this.player];

        let firstPlayerPositions;
        this.socket.connected = () => {
            this.playerList[0].username = this.socket.username;
            firstPlayerPositions = true;
            this.keyboard = new NetworkKeyboard(this.socket);
        };

        this.socket.onmessage = (payload) => {
            if (payload.playerPositions) {
                if (firstPlayerPositions) {
                    firstPlayerPositions = false;
                    for (let i = 0; i < payload.playerPositions.length; i++) {
                        if (payload.playerPositions[i].username !== this.socket.username) {
                            this.addPlayer(payload.playerPositions[i].username);
                        }
                    }
                }

                for (let i = 0; i < payload.playerPositions.length; i++) {
                    for (let j = 0; j < this.playerList.length; j++) {
                        if (this.playerList[j].username === payload.playerPositions[i].username) {
                            this.playerList[j].x = payload.playerPositions[i].x;
                            this.playerList[j].y = payload.playerPositions[i].y;
                        }
                    }
                }
            }

            if (payload.connected) {
                this.addPlayer(payload.connected);
                console.log(payload.connected + ' connected');
            }

            if (payload.disconnected) {
                console.log('got disconnected message');
                console.log(this.playerList);
                for(let i = 0; i < this.playerList.length; i++) {
                    if (this.playerList[i].username === payload.disconnected) {
                        this.tileMap.removeChild(this.playerList[i]);
                        this.playerList.splice(i, 1);
                        console.log(payload.disconnected + ' disconnected');
                    }
                }
            }
        };
    }

    update(delta) {
        this.player.update(delta, this.tileMap);

        if (this.keyboard)
            this.keyboard.update();
    }

    addPlayer(username) {
        let newPlayer = new Player(PIXI.loader.resources["src/textures/cat.png"].texture);
        newPlayer.username = username;
        this.tileMap.addChild(newPlayer);

        this.playerList.push(newPlayer);
    }
}