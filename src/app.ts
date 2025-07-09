import { Application, Request, Response } from "express";
import { Error } from "sequelize";
const express = require('express')
const dotenv = require('dotenv');
const cors = require('cors');

//API SETTINGS
dotenv.config();
const app:Application = express();
const port = process.env['PORT'] || 8000

app.use(cors())

//  Accept json & form-urlencoded
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ROUTES
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'up',
    maintenance: false
  })
})

//  Database connection
const db = require("../utils/database.js");

db.authenticate()
    .then(() => console.log("Database correctly authenticated"))
    .catch((err:Error) => console.log(err))
db.sync()
    .then(() => console.log("Database correctly sincronized"))
    .catch((err:Error) => console.log(err))

app.listen(port, () => {
        console.log(`Server on PORT: ${port}`)})