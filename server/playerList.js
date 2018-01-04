module.exports.PlayerList = class PlayerList {
    constructor() {
        this.players = [];
    }

    // send player data to all players
    updateAllClients() {
        let playerData = [];
        for (let player in this.players) {
            playerData.push(player.data);
        }

        for (let player in this.players) {
            player.gameSocket.send(playerData);
        }
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(username) {
        this.players = this.players.filter(p => p.data.username !== username);
    }

    getPlayerWithUsername(username) {
        for(let i = 0; i < this.players.length; i++) {
            if (this.players[i].data.username === username) {
                return i;
            }
        }

        return -1;
    }

    findUniqueUsername(username) {
        if (this.getPlayerWithUsername(username) == -1) {
            return username;
        } else {
            let extra = 2;
            while (this.getPlayerWithUsername(username + extra) != -1) {
                extra++;
            }

            return username + extra;
        }
    }
}
