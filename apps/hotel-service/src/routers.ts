import { NextFunction, Response, Request, Router } from 'express'
import authenRoute from './routes/auth'
const router = Router()

router.use('/authen', authenRoute )

export default router