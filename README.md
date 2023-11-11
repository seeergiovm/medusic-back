# Configuración del Back-end

Esta guía proporciona los pasos necesarios para configurar el back-end.

## Requisitos previos

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Configuración

### 1. Clona este repositorio:

  git clone https://github.com/seeergiovm/medusic-back.git

### 2. Instala las dependencias si no vienen instaladas:

  cd <nombre_carpeta_proyecto> ('medusic-back' o similar)
  npm install

### 3. Configura la base de datos.

### 4. Iniciar el servidor.

Una vez tengas configurada la base de datos, puedes ejecutar:
  
  npm run dev

El servidor se ejecutará en http://localhost:3000 por defecto.



# Configuración de la Base de Datos

Esta guía proporciona los pasos necesarios para configurar la base de datos.

## Requisitos previos

Asegúrate de tener instalado:
- [MySQL](https://www.mysql.com/) o tu sistema de gestión de bases de datos preferido.

## Pasos de Configuración

### 1. Crear la Base de Datos

Ejecuta el siguiente script SQL para crear la base de datos necesaria para la aplicación.
El script se encuentra en: '/db/database.sql'

### 2. Configurar la conexión

Accede al archivo de configuración de la conexión a la base de datos y proporciona la URL
de conexión, el nombre de usuario y la contraseña.

El archivo se encuentra en la ruta: '/src/db.js'