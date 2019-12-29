const mongoose = require('mongoose')
require('dotenv').config()

// You can put values to these to .env file in the project root
const db_password = process.env.MONGODB_PASSWORD
const db_account = process.env.MONGODB_ACCOUNT
const db_database = process.env.MONGODB_DB

const url = 
`mongodb+srv://${db_account}:${db_password}@cluster0-qw8ew.mongodb.net/${db_database}?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

/* const note = new Note({
     content: 'HTML is Easy',
     date: new Date(),
     important: true,
 })

note.save().then(response => {
    console.log('note saved');
    mongoose.connection.close();
}) 
*/

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
        .then(() => console.log('MongoDB disconnected...'))
        .catch(err => console.log(err))
})