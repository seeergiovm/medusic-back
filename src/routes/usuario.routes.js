import {Router} from 'express'
import multer from 'multer';
import path from 'path';

import { getUsuario, createUsuario, updateUsuario, deleteUsuario, login, 
  buscarUsuarios, getPerfilUsuario, subirImagen, recoverPassword, updatePassword } 
  from '../controllers/usuario.controller.js'

const router = Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/imgProfiles');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


router.get('/usuario/get/:idUsuario', getUsuario);

router.get('/usuario/perfil/:idUsuario', getPerfilUsuario);

router.post('/usuario/create', upload.single('profilePicture'), createUsuario);

router.post('/subir-imagen', upload.single('profilePicture'), subirImagen);

router.post('/usuario/update-perfil', updateUsuario);

router.post('/usuario/update-password', updatePassword);

router.get('/usuario/delete/:idUsuario', deleteUsuario);

router.post('/login', login);

router.get('/usuario/buscar/:termino', buscarUsuarios);

router.get('/recover-password/:mail', recoverPassword);

export default router