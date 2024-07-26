import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

const Productos = () => {
  const [nombre, setNombre] = useState('');
  const [cantidadKgGr, setCantidadKgGr] = useState('');
  const [cantidadUnidades, setCantidadUnidades] = useState('');
  const [dia, setDia] = useState('');
  const [productos, setProductos] = useState([]);
  const [id, setId] = useState(null);
  const navigate = useNavigate();

  //obtien los productos al ejecutar el componete 
  useEffect(() => {
    getProductos();
  }, []);
// leemos los productos 
  const getProductos = async () => {
    const response = await axios.get('http://localhost:3001/productos');
    setProductos(response.data); //actualiza el estado de la api
  };

  const limpiarCampos = () => {
    setNombre('');
    setCantidadKgGr('');
    setCantidadUnidades('');
    setDia('');
    setId(null);
  };
//CREAR/AGREGAR
  const addProducto = () => {
    axios
      .post('http://localhost:3001/createProducto', { //peticion post a la api
        nombre,
        cantidad_kg_gr: cantidadKgGr,
        cantidad_unidades: cantidadUnidades || null, //si esta vacio envia null
        dia: dia.split('T')[0], // Formato correcto para la fecha
      })
      .then(() => {
        getProductos(); //muestro si es exitoso
        limpiarCampos(); //limpio los campos
        Swal.fire({ //alerta de que se cero
          title: 'Producto Creado',
          text: 'El producto fue creado con éxito!',
          icon: 'success',
          timer: 3000,
        });
      })
      .catch((error) => { //si no es exitoso
        Swal.fire({ //muestro alerta de error
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo crear el producto',
          footer: error.message,
        });
      });
  };
//ACTUALIZAR
  const updateProducto = () => {
    axios
      .put('http://localhost:3001/updateProducto', { 
        id,
        nombre,
        cantidad_kg_gr: cantidadKgGr,
        cantidad_unidades: cantidadUnidades || null,
        dia: dia.split('T')[0], // Formato correcto para la fecha
      })
      .then(() => {
        getProductos();
        limpiarCampos();
        Swal.fire({
          title: 'Producto Actualizado',
          text: 'El producto fue actualizado con éxito!',
          icon: 'success',
          timer: 3000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo actualizar el producto',
          footer: error.message,
        });
      });
  };

  const deleteProducto = (id, nombre) => {
    Swal.fire({
      title: 'Eliminar',
      html: `¿Desea eliminar el producto <strong>${nombre}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3001/deleteProducto/${id}`)
          .then(() => {
            getProductos();
            Swal.fire({
              title: `${nombre} fue eliminado`,
              icon: 'success',
              timer: 3000,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se logró eliminar el producto',
              footer: error.message,
            });
          });
      }
    });
  };

  const editProducto = (producto) => {
    setNombre(producto.nombre);
    setCantidadKgGr(producto.cantidad_kg_gr);
    setCantidadUnidades(producto.cantidad_unidades);
    setDia(producto.dia);
    setId(producto.id);
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const handlebtnAtrasClick = () => {
    const role = localStorage.getItem('role');
    if (role === '1') {
      navigate('/home');
    } else if (role === '2') {
      navigate('/homeu');
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-end mt-2">
        <button className="btn btn-light" onClick={handlebtnAtrasClick}>
          <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
        </button>
      </div>
      <h1>Productos</h1>
      <div className="form-group">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Cantidad (kg/gr)"
          value={cantidadKgGr}
          onChange={(e) => setCantidadKgGr(e.target.value)}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Cantidad Unidades"
          value={cantidadUnidades}
          onChange={(e) => setCantidadUnidades(e.target.value)}
        />
        <input
          type="date"
          className="form-control mb-2"
          value={dia.split('T')[0]} // Formato correcto para la fecha
          onChange={(e) => setDia(e.target.value)}
        />
        {id === null ? (
          <button className="btn btn-primary" onClick={addProducto}>Agregar Producto</button>
        ) : (
          <button className="btn btn-warning" onClick={updateProducto}>Actualizar Producto</button>
        )}
        <button className="btn btn-secondary ml-2" onClick={limpiarCampos}>Limpiar Campos</button>
      </div>
      <table className="table table-striped mt-5">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad (kg/gr)</th>
            <th>Cantidad Unidades</th>
            <th>Día</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.cantidad_kg_gr}</td>
              <td>{producto.cantidad_unidades}</td>
              <td>{formatFecha(producto.dia)}</td>
              <td>
                <button className="btn btn-info mr-2" onClick={() => editProducto(producto)}>Editar</button>
                <button className="btn btn-danger" onClick={() => deleteProducto(producto.id, producto.nombre)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;
