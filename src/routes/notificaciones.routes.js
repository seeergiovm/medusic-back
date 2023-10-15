import {Router} from 'express'
import { getNotificaciones} 
  from '../controllers/notificaciones.controller.js'

const router = Router()

router.get('/getNotificaciones/:id', getNotificaciones)

export default router