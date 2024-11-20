import express from "express"
import configRoutes from './routes/index.js'
import exphbs from 'express-handlebars'

const app = express()

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app)

app.listen(3000)