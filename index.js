const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())

const http = require('http')

app.get('/', (req,res) => {
    res.send('<h1>Aktia app</h1>')
})

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
