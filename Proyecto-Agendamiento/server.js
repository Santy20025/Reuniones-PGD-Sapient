import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;

// Configura CORS para permitir solicitudes de tu aplicación React
app.use(cors());

// Analiza los cuerpos JSON de las solicitudes
app.use(bodyParser.json());

// Conectar a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',  // o tu host de base de datos
  user: 'root',       // tu usuario de MySQL
  password: '',       // tu contraseña de MySQL
  database: 'AgendamientoReuniones', // nombre de tu base de datos
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

// Ejemplo de ruta para obtener datos de la base de datos
app.get('/api/reuniones', (req, res) => {
  db.query('SELECT * FROM reuniones', (err, results) => {
    if (err) {
      res.status(500).send('Error en la consulta');
    } else {
      res.json(results);
    }
  });
});

// Ruta para agendar una cita desde el formulario de Home
app.post('/agendar-cita', (req, res) => {
  const { hora, sala, coordinador, fecha } = req.body;

  if (!hora || !sala || !coordinador || !fecha) {
    return res.status(400).send('Datos incompletos');
  }

  const query =
    'INSERT INTO reuniones (hora, sala, coordinador, fecha) VALUES (?, ?, ?, ?)';

  db.query(query, [hora, sala, coordinador, fecha], (err, results) => {
    if (err) {
      console.error('Error al insertar la reunión:', err);
      res.status(500).send('Error al agendar la reunión');
    } else {
      res.status(201).send('Reunión agendada');
    }
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
