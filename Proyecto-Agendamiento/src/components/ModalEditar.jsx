import React from 'react';

const ModalEditar = ({ reunion, onChange, onSubmit }) => {
  return (
    <div className="modal fade" id="modalEditar" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={onSubmit}>
          <div className="modal-header bg-warning">
            <h5 className="modal-title">Editar Reunión</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Fecha</label>
              <input type="date" className="form-control" value={reunion.fecha} onChange={(e) => onChange('fecha', e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Hora</label>
              <input type="time" className="form-control" value={reunion.hora} onChange={(e) => onChange('hora', e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Sala</label>
              <select className="form-select" value={reunion.sala} onChange={(e) => onChange('sala', e.target.value)}>
                <option value="Bogotá">Bogotá</option>
                <option value="Cafetería">Cafetería</option>
                <option value="Terraza">Terraza</option>
                <option value="Buenos Aires">Buenos Aires</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Coordinador</label>
              <input type="text" className="form-control" value={reunion.coordinador} onChange={(e) => onChange('coordinador', e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-warning w-100">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditar;
