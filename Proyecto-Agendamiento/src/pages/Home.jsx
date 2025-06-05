import React, { useState } from 'react';

function Home() {
  const [hora, setHora] = useState('');
  const [sala, setSala] = useState('');
  const [coordinador, setCoordinador] = useState('');
  const [fecha, setFecha] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Función para manejar el envío de datos del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene la acción por defecto del formulario

    // Objeto con los datos del formulario
    const cita = {
      hora,
      sala,
      coordinador,
      fecha,
    };

    try {
      // Enviar los datos al backend (ajusta la URL si es necesario)
      const response = await fetch('http://localhost:5000/agendar-cita', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cita),
      });

      if (response.ok) {
        setMensaje('Cita agendada exitosamente');
        // Limpiar los campos del formulario
        setHora('');
        setSala('');
        setCoordinador('');
        setFecha('');
      } else {
        setMensaje('Hubo un error al agendar la cita');
      }
    } catch (error) {
      console.error('Error al enviar la cita:', error);
      setMensaje('Hubo un error en la conexión');
    }
  };

  return (
    <div className="container bg-light my-4 p-4 shadow">
      <h2 className="text-center mb-4">Agendar una Reunión</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo para la hora */}
        <div className="mb-3">
          <label className="form-label">Hora</label>
          <input
            type="time"
            className="form-control"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          />
        </div>

        {/* Campo para la sala */}
        <div className="mb-3">
          <label className="form-label">Sala</label>
          <select
            className="form-select"
            value={sala}
            onChange={(e) => setSala(e.target.value)}
            required
          >
            <option value="">Seleccione una sala</option>
            <option value="Bogota">Bogotá</option>
            <option value="Cafeteria">Cafetería</option>
            <option value="Buenos Aires">Buenos Aires</option>
            <option value="Terraza">Terraza</option>
          </select>
        </div>

        {/* Campo para el coordinador */}
        <div className="mb-3">
          <label className="form-label">Coordinador</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del coordinador"
            value={coordinador}
            onChange={(e) => setCoordinador(e.target.value)}
            required
          />
        </div>

        {/* Campo para la fecha */}
        <div className="mb-3">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        {/* Botón de envío */}
        <button type="submit" className="btn btn-primary w-100">Agendar</button>
      </form>

      {/* Mensaje de éxito o error */}
      {mensaje && <div className="mt-4 alert alert-info">{mensaje}</div>}
    </div>
  );
}

export default Home;
