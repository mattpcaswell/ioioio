import * as PIXI from 'pixi.js';
import Game from './js/game.js';

import './css/index.css';
import './textures/cat.png';
import './maps/test-map.tmx';
import './maps/tiles.png';

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


// create a game object, initialize it, and set up the game loop
function setup() {
  let game = new Game();
  game.init(app);

  app.ticker.add(delta => game.update(delta));
}
