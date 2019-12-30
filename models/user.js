const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useCreateIndex', true)

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true},
    email: {
        type: String,
        required: true},
    passwordHash: {
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