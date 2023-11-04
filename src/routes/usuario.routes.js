import {Router} from 'express'

import { getUsuario, createUsuario, updateUsuario, deleteUsuario, login, 
  buscarUsuarios, getPerfilUsuario, subirImagen, recoverPassword, updatePassword,
  verifyFollow, addFollow, removeFollow, getListaSeguidos, getListaSeguidores} 
  from '../controllers/usuario.controller.js'

const router = Router()


router.get('/usuario/get/:idUsuario', getUsuario);

router.get('/usuario/perfil/:idUsuario', getPerfilUsuario);

router.get('/usuario/get-seguidos/:idUsuario', getListaSeguidos);

router.get('/usuario/get-seguidores/:idUsuario', getListaSeguidores);

router.post('/usuario/verify-follow', verifyFollow);

router.post('/usuario/add-follow', addFollow);

router.post('/usuario/remove-follow', removeFollow);

router.post('/usuario/create', createUsuario);

router.post('/subir-imagen', subirImagen);

router.post('/usuario/update-perfil', updateUsuario);

router.post('/usuario/update-password', updatePassword);

router.get('/usuario/delete/:idUsuario', deleteUsuario);

router.post('/login', login);

router.get('/usuario/buscar/:termino/:idUsuarioLoggeado', buscarUsuarios);

router.get('/recover-password/:mail', recoverPassword);

export default router