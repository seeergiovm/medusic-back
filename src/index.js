import express from 'express'
import cors from 'cors'

//Routes
import usuarioRoutes from './routes/usuario.routes.js'
import notificacionesRoutes from './routes/notificaciones.routes.js'
import indexRoutes from './routes/index.routes.js'

const app = express();

//Interpreta los datos como json
app.use(express.json())

app.use(cors());

app.use(indexRoutes);
app.use(usuarioRoutes);
app.use(notificacionesRoutes)

app.listen(3000);
console.log('Server running on port 3000');