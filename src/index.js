import * as PIXI from 'pixi.js';
import Player from './js/player.js';
import './css/index.css';
import './textures/cat.png';

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
  .load(setup);

//Define any variables that are used in more than one function
let player;

function setup() {
  //Create the `player` sprite
  player = new Player(resources["src/textures/cat.png"].texture);
  app.stage.addChild(player);

  //Start the game loop
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
  player.update(delta);
}
