import dotenv from 'dotenv'
import express from 'express'
import route from '~/routes'
import databaseServices from '~/services/database.services'
import { errorMiddlewares } from '~/middlewares/error.middlewares'
dotenv.config()
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())

databaseServices.connect()
route(app)
app.use(errorMiddlewares)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})