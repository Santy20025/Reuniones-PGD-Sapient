import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReunionesRealizadas from './pages/ReunionesRealizadas';
import ReunionesPendientes from './pages/ReunionesPendientes';
import ModalAgendar from './components/ModalAgendar';  // Importa el modal si es necesario

function App() {
  const [diaSeleccionado, setDiaSeleccionado] = useState('');

  // Función para manejar el día seleccionado
  const handleDiaSeleccionado = (dia) => {
    setDiaSeleccionado(dia);  // Actualiza el día seleccionado
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home onDiaSeleccionado={handleDiaSeleccionado} />} />
        <Route path="/Home" element={<Home onDiaSeleccionado={handleDiaSeleccionado} />} />
        <Route path="/realizadas" element={<ReunionesRealizadas />} />
        <Route path="/pendientes" element={<ReunionesPendientes />} />
      </Routes>

      {/* Aquí pasamos el día seleccionado al modal */}
      {diaSeleccionado && <ModalAgendar diaSeleccionado={diaSeleccionado} />}
    </Router>
  );
}

export default App;
