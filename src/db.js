import {createPool} from 'mysql2/promise'

//Crear conexion
export const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'svm420',
  port: 3306,
  database: 'medusicdb'
})
