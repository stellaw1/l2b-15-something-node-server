const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    pet_colour: {
        type: String,
        required: true
    },
    friendship_points: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)