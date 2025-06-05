import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'; // Importamos axios
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal } from 'bootstrap'; // ✅ Importar Modal directamente

const ReunionesPendientes = () => {
  const tableRef = useRef(null);
  const [reunionEditada, setReunionEditada] = useState({
    id: '',
    fecha: '',
    hora: '',
    sala: '',
    coordinador: '',
  });
  const [reunionAEliminar, setReunionAEliminar] = useState(null);
  const [reuniones, setReuniones] = useState([]); // Estado para las reuniones
  const [error, setError] = useState(null); // Para manejar errores de la API

  // Sound alert file
  const soundAlert = new Audio('././public/Notificación de iPhone - Sonido.mp3'); // Asumiendo que el archivo se encuentra en la carpeta public

  useEffect(() => {
    // Obtener las reuniones activas desde el backend usando axios
    const obtenerReuniones = async () => {
      try {
        const response = await axios.get('http://localhost:5000/reuniones'); // Cambiamos a axios
        console.log('Reuniones obtenidas:', response.data);
        const reunionesActivas = response.data.filter((reunion) => reunion.estado === 'Activo');
        setReuniones(reunionesActivas);

        // Verificar si falta menos de 5 minutos para alguna reunión
        verificarReunionesProximas(response.data);
      } catch (error) {
        console.error('Error al obtener las reuniones', error);
        setError('Hubo un problema al cargar las reuniones');
      }
    };

    obtenerReuniones();
  }, []); // Solo se ejecuta una vez al cargar el componente

  // Función para verificar si faltan 5 minutos para la reunión
  const verificarReunionesProximas = (reuniones) => {
    const now = new Date();
    reuniones.forEach((reunion) => {
      const fechaReunion = new Date(`${reunion.fecha}T${reunion.hora}`);
      const diffMs = fechaReunion - now;

      // Si faltan 5 minutos o menos para la reunión
      if (diffMs > 0 && diffMs <= 5 * 60 * 1000) {
        // Reproducir sonido de alerta
        soundAlert.play();
      }
    });
  };

  useEffect(() => {
    // Reinicializa DataTables después de que se carguen los datos
    if (reuniones.length > 0) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }

      // Inicializar DataTable después de que se carguen las reuniones
      const table = $(tableRef.current).DataTable({
        pageLength: 15,
      });
    }
  }, [reuniones]); // Se ejecuta cuando se actualiza el estado de reuniones

  const convertirHoraA24 = (hora) => {
    const [h, ap] = hora.split(' ');
    let [hrs, mins] = h.split(':').map(Number);
    if (ap === 'PM' && hrs < 12) hrs += 12;
    if (ap === 'AM' && hrs === 12) hrs = 0;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Función para formatear la fecha en formato mes/día/año
  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    return `${fechaObj.getMonth() + 1}/${fechaObj.getDate()}/${fechaObj.getFullYear()}`;
  };

  const handleEditClick = (e) => {
    const fila = e.target.closest('tr');
    const celdas = fila.querySelectorAll('td');

    setReunionEditada({
      id: fila.getAttribute('data-id'), // Aquí asignamos el ID de la reunión
      fecha: celdas[0].textContent.trim(),
      hora: convertirHoraA24(celdas[1].textContent.trim()),
      sala: celdas[2].textContent.trim(),
      coordinador: celdas[3].textContent.trim(),
    });

    const modalEl = document.getElementById('modalEditar');
    const modal = new Modal(modalEl);
    modal.show();
  };

  const handleDeleteClick = (e) => {
    const fila = e.target.closest('tr');
    const celdas = fila.querySelectorAll('td');

    setReunionAEliminar({
      id: fila.getAttribute('data-id'),
      fecha: celdas[0].textContent.trim(),
      hora: celdas[1].textContent.trim(),
      sala: celdas[2].textContent.trim(),
      coordinador: celdas[3].textContent.trim(),
    });

    const modalEl = document.getElementById('modalEliminar');
    const modal = new Modal(modalEl);
    modal.show();
  };

  // Actualiza el estado de la reunión a "Finalizada"
  const handleConfirmFinalizar = async () => {
    try {
      // Enviar solicitud PUT para actualizar el estado
      const response = await axios.put('http://localhost:5000/finalizar-reunion', {
        id: reunionAEliminar.id,
      });

      // Si la solicitud es exitosa, actualizamos el estado de las reuniones en el frontend
      setReuniones(
        reuniones.map((reunion) =>
          reunion.id === reunionAEliminar.id ? { ...reunion, estado: 'Finalizada' } : reunion
        )
      );

      alert('Reunión finalizada correctamente');

      const modalEl = document.getElementById('modalEliminar');
      const modal = Modal.getInstance(modalEl);
      modal.hide();
    } catch (error) {
      console.error('Error al finalizar la reunión:', error);
      alert('Hubo un problema al finalizar la reunión');
    }
  };

  // Enviar datos actualizados de la reunión
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaReunion = { ...reunionEditada };

    try {
      // Hacemos una solicitud PUT al backend para actualizar la reunión
      const response = await axios.put('http://localhost:5000/actualizar-reunion', nuevaReunion);

      // Actualizamos las reuniones en el estado de React
      setReuniones(
        reuniones.map((reunion) =>
          reunion.id === nuevaReunion.id ? nuevaReunion : reunion
        )
      );

      alert('Reunión actualizada correctamente');
      
      // Cerramos el modal
      const modalEl = document.getElementById('modalEditar');
      const modal = Modal.getInstance(modalEl);
      modal.hide();

    } catch (error) {
      console.error('Error al actualizar la reunión:', error);
      alert('Hubo un problema al actualizar la reunión');
    }
  };

  const handleChange = (campo, valor) => {
    setReunionEditada({ ...reunionEditada, [campo]: valor });
  };

  return (
    <div className="container bg-light my-4 p-4 shadow">
      <h2 className="text-warning text-center">Reuniones Pendientes</h2>

      {/* Modal de error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="table-responsive mt-4">
        <table
          ref={tableRef}
          id="tablaReuniones"
          className="table table-bordered table-striped align-middle text-center"
        >
          <thead className="table-warning">
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Sala</th>
              <th>Coordinador</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reuniones.length > 0 ? (
              reuniones.map((reunion, index) => (
                <tr key={index} data-id={reunion.id}>
                  <td>{reunion.fecha}</td>
                  <td>{reunion.hora}</td>
                  <td>{reunion.sala}</td>
                  <td>{reunion.coordinador}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={handleEditClick}>
                      Modificar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={handleDeleteClick}>
                      Finalizar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay reuniones Pendientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      <div
        className="modal fade"
        id="modalEditar"
        tabIndex="-1"
        aria-labelledby="modalEditarLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalEditarLabel">
                Editar Reunión
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fecha" className="form-label">
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="fecha"
                    value={reunionEditada.fecha}
                    onChange={(e) => handleChange('fecha', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="hora" className="form-label">
                    Hora
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    id="hora"
                    value={reunionEditada.hora}
                    onChange={(e) => handleChange('hora', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="sala" className="form-label">
                    Sala
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="sala"
                    value={reunionEditada.sala}
                    onChange={(e) => handleChange('sala', e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="coordinador" className="form-label">
                    Coordinador
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="coordinador"
                    value={reunionEditada.coordinador}
                    onChange={(e) => handleChange('coordinador', e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Guardar cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de eliminación */}
      <div
        className="modal fade"
        id="modalEliminar"
        tabIndex="-1"
        aria-labelledby="modalEliminarLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalEliminarLabel">
                Confirmar Finalizacion
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas finalizar la reunión del {reunionAEliminar?.fecha} a
                las {reunionAEliminar?.hora}?
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmFinalizar}
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
  

export default ReunionesPendientes;
