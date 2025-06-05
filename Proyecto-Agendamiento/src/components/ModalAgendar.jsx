import React from 'react';

function ModalAgendar() {
  return (
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agendar Reunión</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <form id="formAgendarCita">
              <div className="mb-3">
                <label className="form-label">Hora</label>
                <input type="time" className="form-control" name="hora" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Sala</label>
                <select className="form-select" name="sala" required>
                  <option disabled selected>Seleccione una sala</option>
                  <option value="Bogota">Bogotá</option>
                  <option value="Cafeteria">Cafetería</option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="Terraza">Terraza</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Coordinador</label>
                <input type="text" className="form-control" placeholder="Nombre del coordinador" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha</label>
                <input type="date" className="form-control" required />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" form="formAgendarCita" className="btn btn-primary">Agendar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAgendar;
