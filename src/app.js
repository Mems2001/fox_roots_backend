const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const ProductsRouter = require('./Router/products.router.js')

//API SETTINGS
dotenv.config();
const app = express();
const port = process.env['PORT'] || 8000

app.use(cors());
app.use(bodyParser.json())

//  Accept json & form-urlencoded
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ROUTES
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'up',
    maintenance: false
  })
})

app.use('/api/v1/products', ProductsRouter)

//  Database connection
const db = require("../utils/database.js");

db.authenticate()
    .then(() => console.log("Database correctly authenticated"))
    .catch((err) => console.log(err))
db.sync({alter: true})
    .then(() => console.log("Database correctly sincronized"))
    .catch((err) => console.log(err))

app.listen(port, () => {
        console.log(`Server on PORT: ${port}`)})