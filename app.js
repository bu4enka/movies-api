const express = require('express');
const cors = require('cors')
require('dotenv').config();
require('express-async-errors');
const cookieParser = require("cookie-parser");


const authUser = require('./middleware/auth')
const errorHandlerMiddleware = require('./middleware/error-handler')
const moviesRouter = require('./routes/movies')
const sessionsRouter = require('./routes/sessions')
const usersRouter = require('./routes/users')

const sequelize = require("./models/initModels");

sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
const app = express();
app.use(express.json());
app.use(cors())
app.use(express.static("./public"))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.use('/api/v1/users', usersRouter)
app.use('/api/v1/sessions', sessionsRouter)
app.use('/api/v1/movies', authUser, moviesRouter)

app.use(errorHandlerMiddleware)

const port = process.env.APP_PORT || 3000

app.listen(port, () => {
  console.log(`App is listening to the port ${port}`)
})