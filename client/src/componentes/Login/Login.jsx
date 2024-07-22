import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isRegister) {
            Axios.get('http://localhost:3001/roles').then(response => {
                setRoles(response.data);
            }).catch(error => {
                console.error('Error fetching roles:', error);
            });
        }
    }, [isRegister]);

    const handleAuth = async () => {
        try {
            if (isRegister) {
                const response = await Axios.post('http://localhost:3001/register', {
                    username,
                    password,
                    role
                });
                Swal.fire('Registro Exitoso', 'Usuario registrado correctamente', 'success');
                setIsRegister(false);
                setUsername('');
                setPassword('');
                setRole('');
            } else {
                const response = await Axios.post('http://localhost:3001/login', {
                    username,
                    password
                });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role); // Guarda el rol
                Swal.fire('Login Exitoso', 'Has iniciado sesión correctamente', 'success');

                if (response.data.role === 1) { // 1 es admin
                    navigate('/home'); // Redirige al componente Home 
                } else if (response.data.role === 2) { //2 es user
                    navigate('/homeu'); // Redirige al componente HomeU
                }
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            Swal.fire('Error', error.response?.data?.msg || 'Error desconocido', 'error');
        }
    };

    return (
        <div className="container">
            <h2>{isRegister ? 'Registro' : 'Login'}</h2>
            <div className="mb-3">
                <label className="form-label">Usuario</label>
                <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {isRegister && (
                <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
                        <option value="" disabled>Selecciona un rol</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.nombre}</option>
                        ))}
                    </select>
                </div>
            )}
            <button className="btn btn-primary" onClick={handleAuth}>{isRegister ? 'Registrar' : 'Iniciar Sesión'}</button>
            <button className="btn btn-link" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes una cuenta? Regístrate'}
            </button>
        </div>
    );
};

export default Login;
