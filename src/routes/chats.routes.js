import {Router} from 'express'

import { checkMessages, createChat, enviarMensaje, getConversacion, getListConversaciones,
  verifyCollaboration } 
  from '../controllers/chats.controller.js'

const router = Router()

router.post('/chats/send-message', enviarMensaje);

router.get('/chats/list-conversaciones/:idUsuario', getListConversaciones);

router.get('/chats/get-conversacion/:idUsuarioEmisor/:idUsuarioReceptor', getConversacion);

router.get('/chats/marcar-leidos/:idUsuarioEmisor/:idUsuarioReceptor', checkMessages);

router.post('/chats/verify-collaboration', verifyCollaboration);

router.post('/chats/create-chat', createChat);


export default router;