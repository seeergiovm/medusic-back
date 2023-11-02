import {Router} from 'express'

import { createPublicacion, getPublicacion, addLike, removeLike,
    verifyLike, addComentario, getPublicacionMisSeguidores } 
  from '../controllers/publicaciones.controller.js'

const router = Router()

router.post('/publicacion/create', createPublicacion);

router.get('/publicacion/get/:idPublicacion', getPublicacion);

router.post('/publicacion/verify-like', verifyLike);

router.post('/publicacion/add-like', addLike);

router.post('/publicacion/remove-like', removeLike);

router.post('/publicacion/comentario/new', addComentario);

router.post('/publicacion/mis-seguidores/get-first', getPublicacionMisSeguidores);

router.post('/publicacion/mis-seguidores/get-next', getPublicacionMisSeguidores);

router.post('/publicacion/mis-seguidores/get-previous', getPublicacionMisSeguidores);




export default router;