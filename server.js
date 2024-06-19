// //  Server-side code using Node.js and PostgreSQL

// //  Import necessary modules
// const express = require('express');
// const pg = require('pg');

// //  Create an Express app
// const app = express();

// //  Set up the PostgreSQL connection
// const pool = new pg.Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'bancosolar',
//   password: '11235',
//   port: 5432, //  Default port for PostgreSQL
// });

// // Serve the HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
//   });

// //  Connect to the PostgreSQL database
// pool.query('SELECT NOW()', (err, result) => {
//   if (err) {
//     console.error('Error connecting to PostgreSQL:', err);
//   } else {
//     console.log('Connected to PostgreSQL:', result.rows[0].now);
//   }
// });

// //  Middleware for parsing JSON requests
// app.use(express.json());

// //  GET route for the home page
// app.get('/', (req, res) => {
//   res.send('Welcome to Banco Solar API');
// });

// //  GET route for all users
// app.get('/usuarios', async (req, res) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM usuarios');
//     res.json(rows);
//   } catch (err) {
//     console.error('Error fetching users:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// //  POST route for creating a new user
// app.post('/usuario', async (req, res) => {
//   const { nombre, balance } = req.body;
//   try {
//     const { rows } = await pool.query(
//       'INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *',
//       [nombre, balance]
//     );
//     res.json(rows[0]);
//   } catch (err) {
//     console.error('Error creating user:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// //  PUT route for updating a user
// app.put('/usuario', async (req, res) => {
//   const { id, nombre, balance } = req.body;
//   try {
//     const { rows } = await pool.query(
//       'UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *',
//       [nombre, balance, id]
//     );
//     res.json(rows[0]);
//   } catch (err) {
//     console.error('Error updating user:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// //  DELETE route for deleting a user
// app.delete('/usuario', async (req, res) => {
//   const { id } = req.query;
//   try {
//     const { rows } = await pool.query('DELETE FROM usuarios WHERE id = $1', [
//       id,
//     ]);
//     res.json(rows);
//   } catch (err) {
//     console.error('Error deleting user:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// //  POST route for creating a new transfer
// app.post('/transferencia', async (req, res) => {
//   const { emisor, receptor, monto } = req.body;
//   try {
//     //  Start a transaction
//     await pool.query('BEGIN');

//     //  Update the balances of the sender and receiver
//     const { rows: emisorRows } = await pool.query(
//       'UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2 RETURNING *',
//       [monto, emisor]
//     );

//     const { rows: receptorRows } = await pool.query(
//       'UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2 RETURNING *',
//       [monto, receptor]
//     );

//     //  Check if the update was successful for both users
//     if (emisorRows.length === 0 || receptorRows.length === 0) {
//       await pool.query('ROLLBACK');
//       res.status(400).json({ error: 'Insufficient balance' });
//       return;
//     }

//     //  Insert the new transfer into the transferencias table
//     const { rows: transferRows } = await pool.query(
//       'INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW()) RETURNING *',
//       [emisor, receptor, monto]
//     );

//     //  Commit the transaction
//     await pool.query('COMMIT');

//     res.json(transferRows[0]);
//   } catch (err) {
//     console.error('Error creating transfer:', err);
//     await pool.query('ROLLBACK');
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// //  GET route for all transfers
// app.get('/transferencias', async (req, res) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM transferencias');
//     res.json(rows);
//   } catch (err) {
//     console.error('Error fetching transfers:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// //  Start the server
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
// const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');
// const { Pool } = require('pg');

// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'bancosolar',
//   password: '11235',
//   port: 5432,
// });

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.post('/api/register', async (req, res) => {
//   const { name, balance } = req.body;
//   try {
//     const result = await pool.query(
//       'INSERT INTO users (name, balance) VALUES ($1, $2) RETURNING *',
//       [name, balance]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.get('/api/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.put('/api/users/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name, balance } = req.body;
//   try {
//     const result = await pool.query(
//       'UPDATE users SET name = $1, balance = $2 WHERE id = $3 RETURNING *',
//       [name, balance, id]
//     );
//     res.status(200).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.delete('/api/users/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     await pool.query('DELETE FROM users WHERE id = $1', [id]);
//     res.status(204).send();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/api/transfer', async (req, res) => {
//   const { emisor_id, receptor_id, amount } = req.body;
//   try {
//     await pool.query('BEGIN');
//     const emisor = await pool.query(
//       'SELECT balance FROM users WHERE id = $1',
//       [emisor_id]
//     );
//     const receptor = await pool.query(
//       'SELECT balance FROM users WHERE id = $1',
//       [receptor_id]
//     );
//     if (emisor.rowCount === 0 || receptor.rowCount === 0) {
//       throw new Error('User not found');
//     }
//     if (emisor.rows[0].balance < amount) {
//       throw new Error('Insufficient balance');
//     }
//     await pool.query(
//       'UPDATE users SET balance = balance - $1 WHERE id = $2',
//       [amount, emisor_id]
//     );
//     await pool.query(
//       'UPDATE users SET balance = balance + $1 WHERE id = $2',
//       [amount, receptor_id]
//     );
//     await pool.query('COMMIT');
//     res.status(200).send();
//   } catch (err) {
//     console.error(err);
//     await pool.query('ROLLBACK');
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });

// // Importar los módulos necesarios
// // // Importar los módulos necesarios
// const express = require('express');
// const pg = require('pg');
// const path = require('path');  // Agrega esta línea

// // Crear una aplicación Express
// const app = express();

// // Configurar la conexión a PostgreSQL
// const pool = new pg.Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'bancosolar',
//   password: '11235',
//   port: 5432, // Puerto por defecto para PostgreSQL
// });

// // Servir el archivo HTML
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// // Conectar a la base de datos PostgreSQL
// pool.query('SELECT NOW()', (err, result) => {
//   if (err) {
//     console.error('Error al conectar a PostgreSQL:', err);
//   } else {
//     console.log('Conectado a PostgreSQL:', result.rows[0].now);
//   }
// });

// // Middleware para analizar solicitudes JSON
// app.use(express.json());

// // Ruta GET para la página de inicio
// app.get('/', (req, res) => {
//   res.send('Bienvenido a la API de Banco Solar');
// });

// // Ruta GET para obtener todos los usuarios
// app.get('/usuarios', async (req, res) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM usuarios');
//     res.json(rows);
//   } catch (err) {
//     console.error('Error al obtener usuarios:', err);
//     res.status(500).json({ error: 'Error Interno del Servidor' });
//   }
// });

// // Ruta POST para crear un nuevo usuario
// app.post('/usuario', async (req, res) => {
//   const { nombre, balance } = req.body;

//   // Validar los valores de nombre y balance
//   if (!nombre || balance == null) {
//     return res.status(400).json({ error: 'Nombre y balance son requeridos' });
//   }

//   try {
//     const { rows } = await pool.query(
//       'INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *',
//       [nombre, balance]
//     );
//     res.json(rows[0]);
//   } catch (err) {
//     console.error('Error al crear usuario:', err);
//     res.status(500).json({ error: 'Error Interno del Servidor' });
//   }
// });

// // Ruta PUT para actualizar un usuario
// app.put('/usuario', async (req, res) => {
//   const { id, nombre, balance } = req.body;

//   // Validar los valores de id, nombre y balance
//   if (!id || !nombre || balance == null) {
//     return res.status(400).json({ error: 'ID, nombre y balance son requeridos' });
//   }

//   try {
//     const { rows } = await pool.query(
//       'UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *',
//       [nombre, balance, id]
//     );
//     res.json(rows[0]);
//   } catch (err) {
//     console.error('Error al actualizar usuario:', err);
//     res.status(500).json({ error: 'Error Interno del Servidor' });
//   }
// });

// // Ruta DELETE para eliminar un usuario
// app.delete('/usuario', async (req, res) => {
//   const { id } = req.query;

//   if (!id) {
//     return res.status(400).json({ error: 'ID es requerido' });
//   }

//   try {
//     const { rows } = await pool.query('DELETE FROM usuarios WHERE id = $1', [
//       id,
//     ]);
//     res.json(rows);
//   } catch (err) {
//     console.error('Error al eliminar usuario:', err);
//     res.status(500).json({ error: 'Error Interno del Servidor' });
//   }
// });

// // Ruta POST para crear una nueva transferencia
// app.post('/transferencia', async (req, res) => {
//   const { emisor, receptor, monto } = req.body;

//   if (!emisor || !receptor || monto == null) {
//     return res.status(400).json({ error: 'Emisor, receptor y monto son requeridos' });
//   }

//   try {
//     // Iniciar una transacción
//     await pool.query('BEGIN');

//     // Actualizar los balances del emisor y receptor
//     const { rows: emisorRows } = await pool.query(
//       'UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2 RETURNING *',
//       [monto, emisor]
//     );

//     const { rows: receptorRows } = await pool.query(
//       'UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2 RETURNING *',
//       [monto, receptor]
//     );

//     // Verificar si la actualización fue exitosa para ambos usuarios
//     if (emisorRows.length === 0 || receptorRows.length === 0) {
//       await pool.query('ROLLBACK');
//       res.status(400).json({ error: 'Saldo insuficiente' });
//       return;
//     }

//     // Insertar la nueva transferencia en la tabla transferencias
//     const { rows: transferRows } = await pool.query(
//       'INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW()) RETURNING *',
//       [emisor, receptor, monto]
//     );

//     // Confirmar la transacción
//     await pool.query('COMMIT');

//     res.json(transferRows[0]);
//   } catch (err) {
//     console.error('Error al crear transferencia:', err);
//     await pool.query('ROLLBACK');
//     res.status(500).json({ error: 'Error Interno del Servidor' });
//   }
// });

// // Ruta GET para obtener todas las transferencias
// app.get('/transferencias', async (req, res) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM transferencias');
//     res.json(rows);
//   } catch (err) {
//     console.error('Error al obtener transferencias:', err);
//     res.status(500).json({ error: 'Error Interno del Servidor' });
//   }
// });

// // Iniciar el servidor
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Servidor escuchando en el puerto ${port}`);
// });

// // /const express = require('express');
// const pg = require('pg');
// const path = require('path');
// const express = require('express');

// const app = express();

// const pool = new pg.Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'bancosolar',
//   password: '11235',
//   port: 5432,
// });

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Bienvenido a la API de Banco Solar');
// });

// app.get('/usuarios', async (req, res) => {
//   const client = await pool.connect();
//   try {
//     const { rows } = await client.query('SELECT * FROM usuarios');
//     res.json(rows);
//   } catch (err) {
//     console.error('Error al obtener usuarios:', err);
//     res.status(500).json({ error: 'Error Interno del Servidor' });
//   } finally {
//     client.release();
//   }
// });

// app.post('/usuario', async (req, res) => {
//   const client = await pool.connect();
//   try {
//     const { nombre, balance } = req.body;

//     if (!nombre || balance == null) {
//       return res.status(400).json({ error: 'Nombre y balance son requeridos' });
//     }

//     const { rows } = await client.query(
//       'INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *',
//       [nombre, balance]
//     );
//     res.json(rows[0]);
//   } catch (err) {
//     console.error('Error al crear usuario:', err);
//     res.status(500).json({ error: 'Error Interno del Servidor' });
//   } finally {
//     client.release();
//   }
// });

// app.put('/usuario', async (req, res) => {
//   const client = await pool.connect();
//   try {
//     const { id, nombre, balance } = req.body;

//     if (!id ||!nombre || balance == null) {
//       return res.status(400).json({ error: 'ID, nombre y balance son requeridos' });
//     }

//     const { rows } = await client.query(
//       'UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *',
//       [nombre, balance, id]
//     );
//     res.json(rows[0]);
//   } catch (err) {
//     console.error('Error al actualizar usuario:', err);
//     res.status(500).json({ error: 'Error Interno del Servidor' });
//   } finally {
//     client.release();
//   }
// });

// app.delete('/usuario', async (req, res) => {
//   const client = await pool.connect();
//   try {
//     const { id } = req.query;

//     if (!id) {
//       return res.status(400).json({ error: 'ID es requerido' });
//     }

//     const { rows } = await client.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [
//       id,
//     ]);
//     res.json(rows);
//   } catch (err) {
//     console.error('Error al eliminar usuario:', err);
//     res.status(500).json({ error: 'Error Interno del Servidor' });
//   } finally {
//     client.release();
//   }
// });

// app.post('/transferencia', async (req, res) => {
//   const client = await pool.connect();
//   try {
//     const { emisor, receptor, monto } = req.body;

//     if (!emisor ||!receptor || monto == null) {
//       return res.status(400).json({ error: 'Emisor, receptor y monto son requeridos' });
//     }

//     await client.query('BEGIN');

//     const { rows: emisorRows } = await client.query(
//       'UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2 RETURNING *',
//       [monto, emisor]
//     );

//     const { rows: receptorRows } = await client.query(
//       'UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2 RETURNING *',
//       [monto, receptor]
//     );

//     if (emisorRows.length === 0 || receptorRows.length === 0) {
//       await client.query('ROLLBACK');
//       res.status(400).json({ error: 'Actualización fallida, verifica los usuarios y el monto' });
//       return;
//     }

//     const { rows: transferRows } = await client.query(
//       'INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW()) RETURNING *',
//       [emisor, receptor, monto]
//     );

//     await client.query('COMMIT');

//     res.json(transferRows[0]);
//   } catch (err) {
//     console.error('Error al crear transferencia:',err);
//     await client.query('ROLLBACK');
//     res.status(500).json({ error: 'Error Interno del Servidor' });
//   } finally {
//     client.release();
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor escuchando en el puerto ${PORT}`);
// });
// const serveStatic = require('serve-static');
// const express = require('express');
// const app = express();
// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'bancosolar',
//   password: '11235',
//   port: 5432,
// });

// app.use(express.static('.'));
// app.use(express.json());

// // GET /
// // app.get('/', (req, res) => {
// //   res.sendFile(__dirname + '/index.html');
// // });

// // POST /usuario
// app.post('/usuario', async (req, res) => {
//   try {
//     const { nombre, balance } = req.body;
//     const query = {
//       text: `INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *`,
//       values: [nombre, balance],
//     };
//     const result = await pool.query(query);
//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error al crear usuario' });
//   }
// });

// // GET /usuarios
// app.get('/usuarios', async (req, res) => {
//   try {
//     const query = {
//       text: 'SELECT * FROM usuarios',
//     };
//     const result = await pool.query(query);
//     res.json(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error al obtener usuarios' });
//   }
// });

// // PUT /usuario
// app.put('/usuario', async (req, res) => {
//   try {
//     const { id, nombre, balance } = req.body;
//     const query = {
//       text: `UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *`,
//       values: [nombre, balance, id],
//     };
//     const result = await pool.query(query);
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error al actualizar usuario' });
//   }
// });

// // DELETE /usuario
// app.delete('/usuario', async (req, res) => {
//   try {
//     const { id } = req.body;
//     const query = {
//       text: `DELETE FROM usuarios WHERE id = $1`,
//       values: [id],
//     };
//     await pool.query(query);
//     res.status(204).json({ message: 'Usuario eliminado' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error al eliminar usuario' });
//   }
// });

// // POST /transferencia
// app.post('/transferencia', async (req, res) => {
//   try {
//     const { emisor, receptor, monto } = req.body;
//     const query = {
//       text: `BEGIN TRANSACTION;
//              UPDATE usuarios SET balance = balance - $1 WHERE id = (SELECT id FROM usuarios WHERE nombre = $2);
//              UPDATE usuarios SET balance = balance + $1 WHERE id = (SELECT id FROM usuarios WHERE nombre = $3);
//              INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ((SELECT id FROM usuarios WHERE nombre = $2), (SELECT id FROM usuarios WHERE nombre = $3), $1, NOW());
//              COMMIT;`,
//       values: [monto, emisor, receptor],
//     };
//     await pool.query(query);
//     res.status(201).json({ message: 'Transferencia realizada' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error al realizar transferencia' });
//   }
// });

// // GET /transferencias
// app.get('/transferencias', async (req, res) => {
//     try {
//       const query = {
//         text: `SELECT t.fecha, u1.nombre AS emisor, u2.nombre AS receptor, t.monto
//                FROM transferencias t
//                INNER JOIN usuarios u1 ON t.emisor = u1.id
//                INNER JOIN usuarios u2 ON t.receptor = u2.id`,
//       };
//       const result = await pool.query(query);
//       const transferencias = result.rows.map((row) => ({
//         fecha: row.fecha,
//         emisor: row.emisor,
//         receptor: row.receptor,
//         monto: row.monto,
//       }));
//       res.json(transferencias);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error al obtener transferencias' });
//     }
//   });
  

// app.listen(3000, () => {
//   console.log('Server listening on port 3000');
// });

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bancosolar',
  password: '11235',
  port: 5432,
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/usuario', async (req, res) => {
    const { nombre, balance } = req.body;
    if (!nombre || !balance) {
      return res.status(400).send('Nombre y balance son requeridos');
    }
    try {
      const result = await pool.query(
        'INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *',
        [nombre, balance]
      );
      res.status(201).send(`Usuario agregado correctamente con id ${result.rows[0].id}`);
    } catch (e) {
      console.error(e);
      res.status(500).send('Error al agregar el usuario');
    }
  });

app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al obtener los usuarios');
  }
});

app.put('/usuario', async (req, res) => {
  const { id, nombre, balance } = req.body;
  try {
    const result = await pool.query(
      'UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *',
      [nombre, balance, id]
    );
    res.send(`Usuario actualizado correctamente`);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al actualizar el usuario');
  }
});

app.delete('/usuario', async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.send(`Usuario eliminado correctamente`);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al eliminar el usuario');
  }
});

app.post('/transferencia', async (req, res) => {
  const { emisor, receptor, monto } = req.body;
  try {
    await pool.query('BEGIN');
    const resultEmisor = await pool.query('SELECT balance FROM usuarios WHERE id = $1', [emisor]);
    const resultReceptor = await pool.query('SELECT balance FROM usuarios WHERE id = $1', [receptor]);
    if (resultEmisor.rows[0].balance < monto) {
      await pool.query('ROLLBACK');
      res.status(400).send('No tiene suficiente saldo');
    } else {
      await pool.query('UPDATE usuarios SET balance = balance - $1 WHERE id = $2', [monto, emisor]);
      await pool.query('UPDATE usuarios SET balance = balance + $1 WHERE id = $2', [monto, receptor]);
      await pool.query('INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW())', [emisor, receptor, monto]);
      await pool.query('COMMIT');
      res.send(`Transferencia realizada correctamente`);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al realizar la transferencia');
  }
});

app.get('/transferencias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transferencias');
    res.json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al obtener las transferencias');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Agregar datos por defecto a la base de datos
async function addDefaultData() {
  try {
    await pool.query('INSERT INTO usuarios (nombre, balance) VALUES ($1, $2)', ['Luis Vallejo', 0]);
    await pool.query('INSERT INTO usuarios (nombre, balance) VALUES ($1, $2)', ['Pedro Rivas', 0]);
  } catch (e) {
    console.error(e);
  }
}
addDefaultData();