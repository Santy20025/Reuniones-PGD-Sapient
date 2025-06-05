import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal } from 'bootstrap'; // ✅ Importar Modal directamente
import ModalEditar from '../components/ModalEditar'; // Tu componente del modal

const ReunionesPendientes = () => {
  const tableRef = useRef(null);
  const [reunionEditada, setReunionEditada] = useState({
    fecha: '',
    hora: '',
    sala: '',
    coordinador: '',
  });
  const [reunionAEliminar, setReunionAEliminar] = useState(null);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    const table = $(tableRef.current).DataTable({
      pageLength: 15,
    });

    return () => {
      table.destroy();
    };
  }, []);

  const convertirHoraA24 = (hora) => {
    const [h, ap] = hora.split(' ');
    let [hrs, mins] = h.split(':').map(Number);
    if (ap === 'PM' && hrs < 12) hrs += 12;
    if (ap === 'AM' && hrs === 12) hrs = 0;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleEditClick = (e) => {
    const fila = e.target.closest('tr');
    const celdas = fila.querySelectorAll('td');

    setReunionEditada({
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
      fecha: celdas[0].textContent.trim(),
      hora: celdas[1].textContent.trim(),
      sala: celdas[2].textContent.trim(),
      coordinador: celdas[3].textContent.trim(),
    });

    const modalEl = document.getElementById('modalEliminar');
    const modal = new Modal(modalEl);
    modal.show();
  };

  const handleConfirmDelete = () => {
    alert(`Reunión del ${reunionAEliminar.fecha} eliminada.`);
    const modalEl = document.getElementById('modalEliminar');
    const modal = Modal.getInstance(modalEl);
    modal.hide();
    // Aquí puedes agregar la lógica para eliminar la reunión de la base de datos o el estado
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Reunión actualizada correctamente');
    const modalEl = document.getElementById('modalEditar');
    const modal = Modal.getInstance(modalEl);
    modal.hide();
  };

  const handleChange = (campo, valor) => {
    setReunionEditada({ ...reunionEditada, [campo]: valor });
  };

  return (
    <div className="container bg-light my-4 p-4 shadow">
      <h2 className="text-warning text-center">Reuniones Pendientes</h2>
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
            <tr>
              <td>2025-06-04</td>
              <td>10:00 AM</td>
              <td>Bogotá</td>
              <td>Juan Pérez</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={handleEditClick}>Modificar</button>
                <button className="btn btn-sm btn-danger" onClick={handleDeleteClick}>Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      <ModalEditar
        reunion={reunionEditada}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

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
              <h5 className="modal-title" id="modalEliminarLabel">Confirmar Eliminación</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar la reunión del {reunionAEliminar?.fecha} a las {reunionAEliminar?.hora}?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReunionesPendientes;
