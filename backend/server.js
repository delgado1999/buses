const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors());
app.use(express.json()); // Para recibir JSON en el body

// ===============================
// IMPORTAR RUTAS
// ===============================

// CIUDADES
const ciudadRoutes = require('./routes/ciudad.routes');

// CLIENTES 
const clienteRoutes = require('./routes/cliente.routes'); 

// VENDEDORES 
const vendedorRoutes = require('./routes/vendedorRoutes');


// BUSES 
const busRoutes = require('./routes/busRoutes');

// RESERVAS 
const reservaRoutes = require('./routes/reservaRoutes');

// DETALLE RESERVA 
const detalleReservaRoutes = require('./routes/detalleReservaRoutes');

// ===============================
// USAR RUTAS (ENDPOINTS BASE)
// ===============================

app.use('/api/ciudades', ciudadRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/vendedores', vendedorRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/detalles-reserva', detalleReservaRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(` Servidor iniciado en el puerto ${PORT}`);
});
