import {Router} from 'express'
import multer from 'multer';
import path from 'path';

import { getUsuario, createUsuario, updateUsuario, deleteUsuario, login, 
  buscarUsuarios, getPerfilUsuario, subirImagen} 
  from '../controllers/usuario.controller.js'

const router = Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/imgProfiles');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


router.get('/usuario/get/:username', getUsuario)

router.get('/usuario/perfil/:idUsuario', getPerfilUsuario)

router.post('/usuario/create', createUsuario)

router.post('/subir-imagen', upload.single('profilePicture'), subirImagen);

router.put('/usuario', updateUsuario)

router.delete('/usuario', deleteUsuario)

router.post('/login', login)

router.get('/usuario/buscar/:termino', buscarUsuarios)



export default router