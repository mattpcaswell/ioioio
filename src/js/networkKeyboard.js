import Keyboard from './keyboard.js';

export default class NetworkKeyboard {
    constructor(socket) {
        this.socket = socket;
    }

    update() {
        let pressedKeys = [];

        if (Keyboard.upKey.isDown)
            pressedKeys.push('up');
        if (Keyboard.downKey.isDown)
            pressedKeys.push('down');
        if (Keyboard.leftKey.isDown)
            pressedKeys.push('left');
        if (Keyboard.rightKey.isDown)
            pressedKeys.push('right');

        this.socket.send(pressedKeys);
    }
}