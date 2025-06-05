import React from 'react';

function DiaBox({ dia }) {
  return (
    <div className="col-12 col-md-4 px-1">
      <a href="#" className="text-decoration-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <div className="day-box bg-secondary bg-gradient text-white pt-2 text-center border rounded shadow mb-4">
          <div className="fw-bold fs-3">{dia}</div>
          <div>Agendar Cita</div>
          <div className="row justify-content-md-center">
            <div className="col col-sm-4 mt-2">
              <div className="pb-2 text-white fs-3" data-bs-toggle="tooltip" title="Agendar">⨁</div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default DiaBox;
