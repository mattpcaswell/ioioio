import * as PIXI from 'pixi.js';
import pixiTiled from 'pixi-tiledmap';
import Player from './js/player.js';
import './css/index.css';
import './textures/cat.png';

import './maps/test-map.tmx';
import './maps/tiles.png';

let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;
let keyboard = require("./js/keyboard.js");


// set up the PIXI app fullscreen
var app = new PIXI.Application(window.innerWidth, window.innerHeight, { antialias: true });
document.body.appendChild(app.view);

// keep fullscreen even when the window resizes
window.addEventListener("resize", function() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

// load in textures, and then setup when done
PIXI.loader
  .add("src/textures/cat.png")
  .add("src/maps/test-map.tmx")
  .load(setup);

//Define any variables that are used in more than one function
let player;

function setup() {
  var tileMap = new PIXI.extras.TiledMap("src/maps/test-map.tmx");
  app.stage.addChild(tileMap);

  //Create the `player` sprite
  player = new Player(resources["src/textures/cat.png"].texture);
  app.stage.addChild(player);

  //Start the game loop
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
  player.update(delta);
}
