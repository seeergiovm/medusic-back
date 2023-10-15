import express from 'express'
import usuarioRoutes from './routes/usuario.routes.js'
import indexRoutes from './routes/index.routes.js'
import cors from 'cors'

const app = express();

//Interpreta los datos como json
app.use(express.json())

app.use(cors());

app.use(indexRoutes);
app.use(usuarioRoutes);

app.listen(3000);
console.log('Server running on port 3000');