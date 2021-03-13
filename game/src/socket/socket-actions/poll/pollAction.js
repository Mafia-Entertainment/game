const gameController = require('../../controllers/game/gameController');
const socketHelper = require('../../helpers/socketHelper');

// poll for each player
const pollAction = {
    invoke: async (game, currentRound, roomId, webSocketServer) => {
        game = await gameController.gameSetStatus(game._id, currentRound._id, 'poll');
        game = await gameController.gameSetSpeaker(game._id, currentRound._id, 1);

        for (const [index, value] of game.players.entries()) {
            if (index !== 0) {
                game = await gameController.gameNextSpeaker(game._id, currentRound._id);
            }
            if (value.status === 'kill') continue;

            const returnData = JSON.stringify({
                route: 'game-event',
                roomId: roomId,
                game: game,
                pollEvent: true
            });
            await socketHelper.socketSender(webSocketServer, returnData);
            await socketHelper.sleep(3000);
        }
    },
}

module.exports = pollAction;