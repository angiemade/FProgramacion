import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

const Lista = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getProductos();
  }, []);

  const getProductos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/productos');
      const productosConChecked = response.data.map(producto => ({
        ...producto,
        checked: JSON.parse(localStorage.getItem(`producto-${producto.id}`)) || false
      }));
      setProductos(productosConChecked);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const handleCheckboxChange = (id) => {
    setProductos(prevState =>
      prevState.map(producto => {
        if (producto.id === id) {
          localStorage.setItem(`producto-${producto.id}`, JSON.stringify(!producto.checked));
          return { ...producto, checked: !producto.checked };
        }
        return producto;
      })
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.cantidad_kg_gr.toString().includes(searchTerm) ||
    producto.cantidad_unidades.toString().includes(searchTerm) ||
    formatFecha(producto.dia).includes(searchTerm)
  );

  const handlebtnAtrasClick = () => {
    const role = localStorage.getItem('role');
    if (role === '1') {
      navigate('/home');
    } else if (role === '2') {
      navigate('/homeu');
    }
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end mt-2">
        <button className="btn btn-light" onClick={handlebtnAtrasClick}>
          <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
        </button>
      </div>
      <div className="card text-center mt-4">
        <div className="card-header">
          Gestor de Productos
        </div>
        <div className="card-body">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Buscar productos por nombre, cantidad o fecha"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Check</th>
                <th scope="col">Nombre</th>
                <th scope="col">Cantidad (kg/gr)</th>
                <th scope="col">Cantidad Unidades</th>
                <th scope="col">Día</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((producto) => (
                <tr key={producto.id} className={producto.checked ? 'text-decoration-line-through' : ''}>
                  <th>{producto.id}</th>
                  <td>
                    <input
                      type="checkbox"
                      checked={producto.checked}
                      onChange={() => handleCheckboxChange(producto.id)}
                    />
                  </td>
                  <td>{producto.nombre}</td>
                  <td>{producto.cantidad_kg_gr}</td>
                  <td>{producto.cantidad_unidades}</td>
                  <td>{formatFecha(producto.dia)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Lista;
