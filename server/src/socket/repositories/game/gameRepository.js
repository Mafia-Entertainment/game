const mongoose = require('mongoose');
const Game = require('../../../database/models/game/Game');
const Round = require('../../../database/models/game/Round');
const Player = require('../../../database/models/game/Player');

let Numbers = [1, 2];
let Roles = ['Mafia', 'Peacefull'];

const gameRepository = {
    createGame: async (room) => {
        const gameExist = (await Game.find({ room: room._id }).limit(1))[0];
        if (gameExist) {
            throw new Error('Room already exist');
        }

        let players = [];

        for (const element of room.users) {
            const number = shuffle(Numbers).pop();
            const role = shuffle(Roles).pop();


            const player = new Player({
                _id: new mongoose.Types.ObjectId(),
                user: element,
                number: number,
                role: role,
            });
            await player.save();
            players.push(player);
        }
        rewriteValues();

        const round = new Round({
            _id: new mongoose.Types.ObjectId()
        });
        await round.save();

        const game = new Game({
            _id: new mongoose.Types.ObjectId(),
            players: players,
            room: room,
            rounds: [round],
        });
        await game.save();
        return game;
    },

    updateGameRound: async (gameId, round) => {
        const game = await gameRepository.getGameById(gameId);
        game.rounds.push(round);
        await game.updateOne(game);
    },

    getGameById: async (gameId) => {
        const game = (await Game.find({ _id: gameId }).populate('rounds').populate('players').limit(1))[0];
        if (typeof game !== 'undefined') {
            return game;
        }
        throw new Error('Game doesn\'t exist');
    },

    rewriteValues: async () => {
        Numbers = [1, 2];
        Roles = ['Mafia', 'Peacefull'];
    },

    shuffle: async(arr) => {
        return arr.sort(() => Math.round(Math.random() * 100) - 50);
    },
}

module.exports = gameRepository;

const rewriteValues = () => {
    Numbers = [1, 2];
    Roles = ['Mafia', 'Peacefull'];
}

const shuffle = (arr) => {
    return arr.sort(() => Math.round(Math.random() * 100) - 50);
}