import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { Modal } from "bootstrap"; // ✅ Importar Modal directamente

const ReunionesRealizadas = () => {
  const tableRef = useRef(null);
  const [reuniones, setReuniones] = useState([]); // Estado para las reuniones finalizadas
  const [reunionAEliminar, setReunionAEliminar] = useState(null); // Estado para la reunión a eliminar
  const [error, setError] = useState(null); // Para manejar errores de la API

  useEffect(() => {
    // Obtener las reuniones finalizadas desde el backend usando axios
    const obtenerReuniones = async () => {
      try {
        const response = await axios.get("http://localhost:5000/reuniones-Finalizadas");
        console.log("Reuniones obtenidas:", response.data);
        setReuniones(response.data); // Establecer las reuniones finalizadas
      } catch (error) {
        console.error("Error al obtener las reuniones", error);
        setError("Hubo un problema al cargar las reuniones.");
      }
    };

    obtenerReuniones();
  }, []); // Solo se ejecuta una vez al cargar el componente

  // Reinicializa DataTables después de que se carguen los datos
  useEffect(() => {
    let table;
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    if (reuniones.length > 0) {
      table = $(tableRef.current).DataTable({
        pageLength: 15,
      });
    }

    return () => {
      if (table) {
        table.destroy();
      }
    };
  }, [reuniones]); // Se ejecuta cuando se actualiza el estado de reuniones

  const convertirHoraA24 = (hora) => {
    const [h, ap] = hora.split(" ");
    let [hrs, mins] = h.split(":").map(Number);
    if (ap === "PM" && hrs < 12) hrs += 12;
    if (ap === "AM" && hrs === 12) hrs = 0;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  // Función para manejar la eliminación de una reunión
  const handleEliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/eliminar-reunion/${id}`);
      // Filtrar la reunión eliminada del estado
      setReuniones(reuniones.filter((reunion) => reunion.id !== id));
      alert("Reunión eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la reunión:", error);
      alert("Hubo un problema al eliminar la reunión");
    }
  };

  // Función para mostrar el modal de confirmación de eliminación
  const handleDeleteClick = (e) => {
    const fila = e.target.closest("tr");
    const celdas = fila.querySelectorAll("td");

    setReunionAEliminar({
      id: fila.getAttribute("data-id"),
      fecha: celdas[0].textContent.trim(),
      hora: celdas[1].textContent.trim(),
      sala: celdas[2].textContent.trim(),
      coordinador: celdas[3].textContent.trim(),
    });

    const modalEl = document.getElementById("modalEliminar");
    const modal = new Modal(modalEl);
    modal.show();
  };

  // Confirmar la eliminación
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/eliminar-reunion/${reunionAEliminar.id}`);
      // Eliminar la reunión de la lista en el frontend
      setReuniones(reuniones.filter((reunion) => reunion.id !== reunionAEliminar.id));
      alert("Reunión eliminada correctamente");

      const modalEl = document.getElementById("modalEliminar");
      const modal = Modal.getInstance(modalEl);
      modal.hide();
    } catch (error) {
      console.error("Error al eliminar la reunión:", error);
      alert("Hubo un problema al eliminar la reunión");
    }
  };

  return (
    <div className="container bg-light my-4 p-4 shadow">
      <h2 className="text-warning text-center">Reuniones Realizadas</h2>

      {/* Mostrar error si no se pueden cargar las reuniones */}
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
              reuniones.map((reunion) => (
                <tr key={reunion.id} data-id={reunion.id}>
                  <td>{reunion.fecha}</td>
                  <td>{reunion.hora}</td>
                  <td>{reunion.sala}</td>
                  <td>{reunion.coordinador}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={handleDeleteClick}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay reuniones finalizadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
                Confirmar eliminación
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
                ¿Estás seguro de que deseas eliminar la reunión del {reunionAEliminar?.fecha} a
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

export default ReunionesRealizadas;
