require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const usersRouter = require('./controllers/users')

app.use(cors())
app.use(bodyParser.json())

app.use('/api/users', usersRouter)



app.get('/', (req,res) => {
    res.send('<h1>Aktia app</h1>')
})


const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
