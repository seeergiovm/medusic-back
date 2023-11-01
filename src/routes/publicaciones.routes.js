import {Router} from 'express'

import { createPublicacion, getPublicacion } 
  from '../controllers/publicaciones.controller.js'

const router = Router()

router.post('/publicacion/create', createPublicacion);

router.get('/publicacion/get/:idPublicacion', getPublicacion);


export default router