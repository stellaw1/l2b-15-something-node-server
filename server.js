const express = require('express')
// const mongoose = require('mongoose')
// const dotenv = require('dotenv').config()
const app = express()
const port = 3000

// mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
// const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to database'))

app.use(express.json())

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`node-server listening on port ${port}`)
})
