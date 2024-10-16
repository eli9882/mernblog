/*const express = require('express')
require('dotenv').config()
const {connect} = require("mongoose")
const cors = require('cors')
const upload = require('express-fileupload')


const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes')
const {notFound, errorHandler} = require('./middleware/errorMiddleware')

const app = express();
app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: true}))
app.use(cors({credentials: true, origin: ['https://centrohatillosansebastiancr.netlify.app','http://localhost:3000']}))

app.use(upload({
  useTempFiles: true,  // Habilitar archivos temporales
  tempFileDir: '/tmp/',  // Ruta de archivos temporales
}));



app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use(notFound)
app.use(errorHandler)


connect(process.env.MONGO_URI)
.then(app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT}`)))
.catch(error => console.log(error))*/


/*const express = require('express');
require('dotenv').config();
const { connect } = require('mongoose');
const cors = require('cors');
const upload = require('express-fileupload');

const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilitar CORS para solicitudes desde Netlify y localhost
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://centrohatillosansebastiancr.netlify.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Aplicar middleware CORS general
app.use(cors({
  origin: ['https://centrohatillosansebastiancr.netlify.app', 'http://localhost:3000'],
  credentials: true
}));

// Configuración para subir archivos
app.use(upload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

// Definir rutas
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Middleware para manejar errores
app.use(notFound);
app.use(errorHandler);

// Conectar a la base de datos y levantar el servidor
connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT}`)))
  .catch(error => console.log(error));
*/
const express = require('express');
require('dotenv').config();
const { connect } = require("mongoose");
const cors = require('cors');
const upload = require('express-fileupload');

const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Configura CORS antes de definir las rutas
app.use(cors({
  credentials: true,
  origin: ['https://centrohatillosansebastiancr.netlify.app', 'http://localhost:3000']
}));

app.use(upload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URI)
  .then(app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT}`)))
  .catch(error => console.log(error));
