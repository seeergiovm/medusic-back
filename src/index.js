import express from 'express'
import cors from 'cors'
// import bodyParser from 'body-parser'
import path from 'path';

//Routes
import usuarioRoutes from './routes/usuario.routes.js'
import notificacionesRoutes from './routes/notificaciones.routes.js'
import publicacionesRoutes from './routes/publicaciones.routes.js'

const app = express();

const maxRequestBodySize = '5mb';
//Interpreta los datos como json
app.use(express.json({limit: maxRequestBodySize}));

app.use(cors());

app.use(usuarioRoutes);
app.use(notificacionesRoutes);
app.use(publicacionesRoutes);

app.listen(3000);
console.log('Server running on port 3000');