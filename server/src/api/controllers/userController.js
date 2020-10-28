const mongoose = require('mongoose');
const User = require('../../models/User');

module.exports = {
    createUser: async (email, name, password) => {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: email,
            name: name,
            password: password,
        });
        try {
            return await user.save();
        } catch (error) {
            throw error
        }
    },

    getUser: async (id) => {
        // ..
    },

    getAllUsers: async() => {
        // ...
    }
}