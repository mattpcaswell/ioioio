import keyboard from "./keyboard.js";

class Player extends PIXI.Sprite {
    constructor(...args) {
        super(...args);

        this.vx = 0;
        this.vy = 0;
        this.height = 32;
        this.width = 32;
    }

    update(delta) {
        this.handleKeyboard();

        this.x += this.vx;
        this.y += this.vy
    }

    handleKeyboard() {
        this.vy = 0;
        this.vx = 0;

        if (keyboard.upKey.isDown)
            this.vy -= 5;
        if (keyboard.downKey.isDown)
            this.vy += 5;
        if (keyboard.leftKey.isDown)
            this.vx -= 5;
        if (keyboard.rightKey.isDown)
            this.vx += 5;
    }
}

export default Player;