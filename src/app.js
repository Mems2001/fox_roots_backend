const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookie_parser = require('cookie-parser');
const session = require('express-session');

const AuthRouter = require('./Router/auth.router.js');
const ProductsRouter = require('./Router/products.router.js');
const ProductIndividualsRouter = require('./Router/productIndividuals.router.js');

//API SETTINGS
dotenv.config();
const app = express();
const port = process.env['PORT'] || 8000
app.use(cookie_parser())
app.use(bodyParser.json())
app.use(session({
  secret: process.env.SESSION_SECRET
}))

// Cors settings
app.use(cors({
  origin: ['http://localhost:4200' , 'https://foxroots593.netlify.app'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}))

//Cookies settings
app.use((req, res, next) => {
  res.setCookie = (name, value, options = {}) => {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Configuración para CORS
      maxAge: 1000 * 60 * 60 * 24, // 1 día por defecto
      // domain: process.env.NODE_ENV === 'production' ? 'fox-roots-backend-exq8.com' : undefined,
      path: '/'
    };
    const finalOptions = { ...defaultOptions, ...options }
    res.cookie(name, value, finalOptions)
  };

  res.delCookie = (name, options = {}) => {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? 'fox-roots-backend-exq8.com' : undefined,
      path:  '/'
    };
    const finalOptions = { ...defaultOptions, ...options }
    console.log('Clearing cookie with options:', finalOptions)
    res.clearCookie(name, finalOptions);
  };

  next();
});

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

app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/products', ProductsRouter)
app.use('/api/v1/individuals', ProductIndividualsRouter)

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