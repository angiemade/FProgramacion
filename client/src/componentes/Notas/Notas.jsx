import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

const Notas = () => {
  const [nota, setNota] = useState("");
  const [notasList, setNotasList] = useState([]);
  const navigate = useNavigate();

  const addNota = () => {
    Axios.post("http://localhost:3001/createNota", {
      contenido: nota
    }).then(() => {
      getNotas();
      setNota("");
      Swal.fire({
        title: "Nota Enviada",
        text: "La nota fue creada con éxito!",
        icon: "success",
        timer: 3000
      });
    }).catch(error => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudo crear la nota",
        footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más tarde" : JSON.parse(JSON.stringify(error)).message,
      });
    });
  };

  const getNotas = () => {
    Axios.get("http://localhost:3001/notas").then(response => {
      setNotasList(response.data);
    });
  };

  useEffect(() => {
    getNotas();
  }, []);

  const handlebtnAtrasClick = () => {
    const role = localStorage.getItem('role');
    if (role === '1') {
      navigate('/home');
    } else if (role === '2') {
      navigate('/homeu');
    }
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-end mt-2">
        <button className="btn btn-light" onClick={handlebtnAtrasClick}>
          <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '1.5rem' }}></i>
        </button>
      </div>
      <div className="card">
        <div className="card-header">
          <h5>Notas</h5>
        </div>
        <div className="card-body">
          <textarea
            className="form-control mb-3"
            rows="4"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Escribe una nota..."
          ></textarea>
          <button className="btn btn-primary" onClick={addNota}>
            <i className="bi bi-send-fill"></i> Enviar
          </button>
        </div>
        <ul className="list-group list-group-flush">
          {notasList.map((nota, index) => (
            <li key={index} className="list-group-item">{nota.contenido}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notas;
