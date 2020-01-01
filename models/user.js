const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//mongoose.set('useCreateIndex', {sparse:true})

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true},
        unique: false,
    email: {
        type: String,
        required: true,
        unique: true},
    passwordHash: {
        type: String,
        required: true,
        unique: false},
    date: {
        type: Date,
        default: Date.now,
        unique: false},
    goal: {
        type: Number,
        required: false,
        unique: false
    }
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // the passwordHash should not be revealed
      delete returnedObject.passwordHash
    }
  })

const User = mongoose.model('User', userSchema)

module.exports = User