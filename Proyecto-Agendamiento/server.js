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

// Obtener todas las reuniones (GET)
app.get('/', (req, res) => {
  const query = 'SELECT * FROM Reunion';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Obtener todas las reuniones con estado 'Activo'
app.get('/reuniones', (req, res) => {
  const query = 'SELECT * FROM Reunion WHERE estado = "Activo"'; // Filtramos solo las reuniones activas
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results); // Devuelve solo las reuniones activas
  });
});
// Obtener todas las reuniones con estado 'Finalizada'
app.get('/reuniones-Finalizadas', (req, res) => {
  const query = 'SELECT * FROM Reunion WHERE estado = "Finalizada"'; // Filtramos solo las reuniones activas
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results); // Devuelve solo las reuniones activas
  });
});

// Crear una reunión (POST)
app.post('/agendar-cita', (req, res) => {
  const { hora, sala, coordinador, fecha } = req.body;
  
  // Agregar la reunión con el valor predeterminado para 'estado' que es 'Activo'
  const query = 'INSERT INTO Reunion (hora, sala, coordinador, fecha) VALUES (?, ?, ?, ?)';
  
  db.query(query, [hora, sala, coordinador, fecha], (err, result) => {
    if (err) {
      console.error('Error al insertar la reunión:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Reunión creada con éxito', id: result.insertId });
  });
});

// Actualizar una reunión (PUT)
app.put('/actualizar-reunion', (req, res) => {
  const { id, hora, sala, coordinador, fecha } = req.body;

  console.log('Datos recibidos para actualizar:', { id, hora, sala, coordinador, fecha }); // Agrega esta línea para depuración

  // Verificar si los datos necesarios están presentes
  if (!id || !hora || !sala || !coordinador || !fecha) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Consulta SQL para actualizar la reunión
  const query = `UPDATE Reunion SET hora = ?, sala = ?, coordinador = ?, fecha = ? WHERE id = ?`;

  db.query(query, [hora, sala, coordinador, fecha, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar la reunión:', err);
      return res.status(500).json({ error: err.message });
    }

    console.log('Resultado de la actualización:', result); // Agrega esta línea para depuración

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reunión no encontrada' });
    }

    res.status(200).json({ message: 'Reunión actualizada con éxito' });
  });
});

// Cambiar el estado de la reunión a Finalizada (PUT)
app.put('/finalizar-reunion', (req, res) => {
  const { id } = req.body;

  // Verificar si el id de la reunión es válido
  if (!id) {
    return res.status(400).json({ error: 'El ID de la reunión es necesario' });
  }

  // Actualizamos el estado de la reunión a 'Finalizada'
  const query = `UPDATE Reunion SET estado = 'Finalizada' WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al cambiar el estado de la reunión:', err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reunión no encontrada' });
    }

    res.status(200).json({ message: 'Reunión finalizada con éxito' });
  });
});

// Eliminar una reunión (DELETE)
app.delete('/eliminar-reunion/:id', (req, res) => {
  const { id } = req.params;

  // Consulta SQL para eliminar la reunión
  const query = `DELETE FROM Reunion WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar la reunión:', err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reunión no encontrada' });
    }

    res.status(200).json({ message: 'Reunión eliminada con éxito' });
  });
});



// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
