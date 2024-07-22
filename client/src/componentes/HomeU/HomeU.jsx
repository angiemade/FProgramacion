import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

const HomeU = () => {
    const navigate = useNavigate();

   

    const handleListadoProductosClick = () => {
        navigate('/lista');
    };

    const handleNotasClick = () => {
        navigate('/notas');
    };

    const handleCerrarSesion = async () => {
        try {
            await axios.post('http://localhost:3001/logout'); // Asegúrate de que la URL sea correcta
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/');
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
        }
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="d-flex">
                    
                    <Button variant="secondary" onClick={handleListadoProductosClick} className="btnMenuLista me-2">
                        Listado de Productos
                    </Button>
                </div>
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-person-fill"></i> {/* Icono de usuario */}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item disabled>Usuario</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleCerrarSesion} className="btnCerrarSesion">
                            Cerrar sesión
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <hr />
            <div className="mt-3">
                <Button variant="secondary" onClick={handleNotasClick} className="btnNotas">
                    NOTAS
                </Button>
            </div>
        </div>
    );
};

export default HomeU
