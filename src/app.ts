import { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

app.listen(port, () => {
        console.log(`Server on PORT: ${port}`)})