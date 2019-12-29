const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true},
    name: {
        type: String,
        required: true},
    email: {
        type: String,
        required: true},
    passWordhash: {
        type: String,
        required: true},
    date: {
        type: Date,
        default: Date.now
    }
})

userSchema.plugin(uniqueValidator)
const User = mongoose.model('User', userSchema)

module.exports = User