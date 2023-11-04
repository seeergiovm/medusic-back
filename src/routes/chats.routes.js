import {Router} from 'express'

import { checkMessages, enviarMensaje, getConversacion, getListConversaciones,  } 
  from '../controllers/chats.controller.js'

const router = Router()

router.post('/chats/send-message', enviarMensaje);

router.get('/chats/list-conversaciones/:idUsuario', getListConversaciones);

router.get('/chats/get-conversacion/:idUsuarioEmisor/:idUsuarioReceptor', getConversacion);

router.get('/chats/marcar-leidos/:idUsuarioEmisor/:idUsuarioReceptor', checkMessages);

export default router;