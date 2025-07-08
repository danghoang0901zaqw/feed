import express from 'express'
import UsersControllers from '~/controllers/users.controllers'
const router = express.Router()

router.route('/').get(UsersControllers.get)
export default router
