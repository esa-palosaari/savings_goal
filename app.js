require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')
const testAPIRouter = require('./controllers/testAPI')
const accountsRouter = require('./controllers/accounts')
const loginRouter = require('./controllers/login')

// You can put values to these to .env file in the project root
const db_password = process.env.MONGODB_PASSWORD
const db_account = process.env.MONGODB_ACCOUNT
const db_database = process.env.MONGODB_DB

const url = 
`mongodb+srv://${db_account}:${db_password}@cluster0-qw8ew.mongodb.net/${db_database}?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))


app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use('/api/testApi', testAPIRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/accounts', accountsRouter)


app.get('/', (req,res) => {
    res.send('<h1>Aktia app</h1>')
})


// before getting access to Aktia Sandbox
app.get('/api/accounts', (req, res) => {
    res.send(JSON.stringify(accountData))
})

const unknownEndpoint = (request, response) => {
    response.status(404)
  }
  
app.use(unknownEndpoint)

module.exports = app