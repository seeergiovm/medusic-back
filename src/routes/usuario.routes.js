import {Router} from 'express'
import { getUsuario, createUsuario, updateUsuario, deleteUsuario} 
  from '../controllers/usuario.controller.js'

const router = Router()

router.get('/usuario', getUsuario)

router.post('/usuario', createUsuario)

router.put('/usuario', updateUsuario)

router.delete('/usuario', deleteUsuario)

export default router