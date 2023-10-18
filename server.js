const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const routes = require('./routes')


const dotenv = require('dotenv')

dotenv.config();

const PORT = process.env.PORT || 5000

const app = express()

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to mongo DB")
})
.catch(error => console.log(error))

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: " this is simple route"})
})

app.use('/api', routes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}` )
})