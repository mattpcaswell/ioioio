module.exports = class Player {
    constructor(gameSocket, username) {
        this.gameSocket = gameSocket;

        this.data = {};
        this.data.username = username;
        this.data.x = 0;
        this.data.y = 0;
    }
}
