import {Router} from 'express'
import { getNotificaciones} 
  from '../controllers/notificaciones.controller.js'

const router = Router()

router.get('/notificaciones/:idUsuario', getNotificaciones)

export default router