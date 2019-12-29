const mongoose = require('mongoose')
require('dotenv').config()
const password = process.env.MONGODB_PASSWORD
console.log(password)

const url = 
`mongodb+srv://backend_aktia:${password}@cluster0-qw8ew.mongodb.net/note-test?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser:true})

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
})