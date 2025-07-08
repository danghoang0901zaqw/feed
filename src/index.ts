import dotenv from 'dotenv'
import express from 'express'
import route from '~/routes'
import databaseServices from '~/services/database.services'
dotenv.config()
const app = express()
const port =process.env.PORT|| 5000
app.use(express.json())

route(app)
databaseServices.connect()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})