const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'FinalAngie'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Registro de usuarios
app.post('/register', (req, res) => {
    const { username, password, role } = req.body;

    // Verificar si el nombre de usuario ya existe
    db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }

        if (results.length > 0) {
            return res.status(409).json({ msg: 'El nombre de usuario ya existe' });
        }

        // Verificar si la contraseña ya ha sido utilizada por otro usuario
        const hashedPassword = bcrypt.hashSync(password, 10);
        db.query('SELECT * FROM usuarios WHERE password = ?', [hashedPassword], (err, results) => {
            if (err) {
                return res.status(500).json({ msg: err.message });
            }

            if (results.length > 0) {
                return res.status(409).json({ msg: 'La contraseña ya ha sido utilizada por otro usuario' });
            }

            // Insertar el nuevo usuario
            db.query('INSERT INTO usuarios (username, password, role_id) VALUES (?, ?, ?)', [username, hashedPassword, role], (err, result) => {
                if (err) {
                    return res.status(500).json({ msg: err.message });
                }
                return res.status(201).json(result);
            });
        });
    });
});

// Inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }

        if (results.length > 0) {
            const user = results[0];
            const isValid = bcrypt.compareSync(password, user.password);

            if (isValid) {
                const token = jwt.sign({ id: user.id, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.json({ token, role: user.role_id });
            } else {
                return res.status(401).json({ msg: 'Credenciales incorrectas' });
            }
        } else {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
    });
});

// Cerrar sesión
app.post('/logout', (req, res) => {
    res.json({ msg: 'Sesión cerrada' });
});

// Obtener roles
app.get('/roles', (req, res) => {
    db.query('SELECT id, nombre FROM roles', (err, results) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        }
        return res.json(results);
    });
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Rutas para las notas

app.post('/createNota', (req, res) => {
    const contenido = req.body.contenido;

    db.query('INSERT INTO notas (contenido) VALUES (?)', [contenido], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        } else {
            return res.send(result);
        }
    });
});

// Obtener notas
app.get('/notas', (req, res) => {
    db.query('SELECT * FROM notas', (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        } else {
            return res.send(result);
        }
    });
});

// Crear producto
app.post("/createProducto", (req, res) => {
  const { nombre, cantidad_kg_gr, cantidad_unidades, dia } = req.body;
  db.query('INSERT INTO productos (nombre, cantidad_kg_gr, cantidad_unidades, dia) VALUES (?, ?, ?, ?)', 
      [nombre, cantidad_kg_gr, cantidad_unidades, dia], 
      (err, result) => {
          if (err) {
              console.log(err);
              return res.status(500).send("Error al crear el producto");
          } else {
              return res.status(201).send("Producto creado exitosamente");
          }
      });
});

// Obtener todos los productos
app.get("/productos", (req, res) => {
  db.query('SELECT * FROM productos', (err, result) => {
      if (err) {
          console.log(err);
          return res.status(500).send("Error al obtener los productos");
      } else {
          return res.send(result);
      }
  });
});

// Actualizar producto
app.put("/updateProducto", (req, res) => {
  const { id, nombre, cantidad_kg_gr, cantidad_unidades, dia } = req.body;
  db.query('UPDATE productos SET nombre=?, cantidad_kg_gr=?, cantidad_unidades=?, dia=? WHERE id=?', 
      [nombre, cantidad_kg_gr, cantidad_unidades, dia, id], 
      (err, result) => {
          if (err) {
              console.log(err);
              return res.status(500).send("Error al actualizar el producto");
          } else {
              return res.send("Producto actualizado exitosamente");
          }
      });
});

// Eliminar producto
app.delete("/deleteProducto/:id", (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id=?', id, 
      (err, result) => {
          if (err) {
              console.log(err);
              return res.status(500).send("Error al eliminar el producto");
          } else {
              return res.send("Producto eliminado exitosamente");
          }
      });
});
  

// Configuración del puerto
app.listen(3001, () => {
  console.log("Corriendo en el puerto 3001");
});