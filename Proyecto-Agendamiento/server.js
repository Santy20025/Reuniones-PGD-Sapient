import express from 'express';
import mysql from 'mysql2'; // Usamos mysql2 para la conexión

const app = express();
const port = 5000;

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Tu usuario de MySQL
    password: 'tu_contraseña', // Tu contraseña de MySQL
    database: 'AgendamientoReuniones' // El nombre de la base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos como id ' + connection.threadId);
});

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Ruta de ejemplo para obtener todas las reuniones
app.get('/reuniones', (req, res) => {
    connection.query('SELECT * FROM Reunion', (err, results) => {
        if (err) {
            console.error('Error al obtener las reuniones: ' + err.stack);
            return res.status(500).send('Error en la base de datos');
        }
        res.json(results);
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
