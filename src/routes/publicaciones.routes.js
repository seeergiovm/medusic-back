import {Router} from 'express'

import { createPublicacion, getPublicacion, addLike, removeLike,
    verifyLike } 
  from '../controllers/publicaciones.controller.js'

const router = Router()

router.post('/publicacion/create', createPublicacion);

router.get('/publicacion/get/:idPublicacion', getPublicacion);

router.post('/publicacion/verify-like', verifyLike);

router.post('/publicacion/add-like', addLike);

router.post('/publicacion/remove-like', removeLike);




export default router;