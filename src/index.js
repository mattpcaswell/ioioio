import * as PIXI from 'pixi.js';
import './css/index.css';
import './textures/cat.png';

let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;
let keyboard = require("./js/keyboard.js");

var app = new PIXI.Application(window.innerWidth, window.innerHeight, { antialias: true });
document.body.appendChild(app.view);

window.addEventListener("resize", function() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

PIXI.loader
  .add("src/textures/cat.png")
  .load(setup);

//Define any variables that are used in more than one function
let cat, state;

function setup() {
  //Create the `cat` sprite
  cat = new Sprite(resources["src/textures/cat.png"].texture);
  cat.y = 96;
  cat.vx = 0;
  cat.vy = 0;
  app.stage.addChild(cat);


  //Set the game state
  state = play;

  //Start the game loop
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
  handleKeyboard();

  //Update the current game state:
  state(delta);
}

function handleKeyboard() {
  cat.vy = 0;
  cat.vx = 0;

  if (keyboard.upKey.isDown)
    cat.vy -= 5;
  if (keyboard.downKey.isDown)
    cat.vy += 5;
  if (keyboard.leftKey.isDown)
    cat.vx -= 5;
  if (keyboard.rightKey.isDown)
    cat.vx += 5;
}

function play(delta) {
  //Use the cat's velocity to make it move
  cat.x += cat.vx;
  cat.y += cat.vy
}
