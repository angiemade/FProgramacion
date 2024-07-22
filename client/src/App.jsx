import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Notas from './componentes/Notas/Notas'
import Productos from './componentes/Productos/Productos';
import Home from './componentes/Home/Home';
import Lista from './componentes/Lista/Lista';
import Login from './componentes/Login/Login';
import HomeU from './componentes/HomeU/HomeU';

const App=()=> {
 
  return (
    <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/home" element={<Home />} />
                <Route path="/lista" element={<Lista />} />
                <Route path="/notas" element={<Notas />} />
                <Route path="/homeu" element={<HomeU />} />
            </Routes>
        </Router>
  )
}

export default App;
