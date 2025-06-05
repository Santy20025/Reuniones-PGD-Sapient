import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

const ReunionesRealizadas = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    let table;

    // Destruir si ya existe DataTable
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    // Inicializar DataTable
    table = $(tableRef.current).DataTable({
      pageLength: 15,
    });

    // Cleanup al desmontar el componente
    return () => {
      if (table) {
        table.destroy();
      }
    };
  }, []);

  return (
    <div className="container bg-light my-4 p-4 shadow">
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-06-04</td>
              <td>10:00 AM</td>
              <td>Bogotá</td>
              <td>Juan Pérez</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReunionesRealizadas;
