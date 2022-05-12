const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
// const mongoose = require('mongoose')
require('dotenv').config();
const router = express()

// Express APIs
const api = require('./routes/pregnancy.routes')

// mongoose
//   .connect(`mongodb+srv://${process.env.SQL_DB_NAME}:${process.env.SQL_PASSWORD}@cluster0.9zbdr.mongodb.net/qc-app?retryWrites=true&w=majority`)
//   .then((x) => {
//     console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
//   })
//   .catch((err) => {
//     console.error('Error connecting to mongo', err.reason)
//   })

// Express settings
router.use(bodyParser.json())
router.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
router.use(cors())

// Serve static resources
// app.use('/public', express.static('public'))
router.use('/api', api)

// Define PORT
const port = process.env.PORT || 4000

const server = router.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Express error handling
// app.use((req, res, next) => {
//     setImmediate(() => {
//       next(new Error('Something went wrong'))
//     })  
 
// })

router.use(function (err, req, res, next) {
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.message)
})
