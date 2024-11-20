import express from "express"
import configRoutes from './routes/index.js'

const app = express()

configRoutes(app)

app.listen(3000)