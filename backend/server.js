const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); 

const ciudadRoutes = require('./routes/ciudad.routes');
const clienteRoutes = require('./routes/cliente.routes'); 
const vendedorRoutes = require('./routes/vendedorRoutes');
const busRoutes = require('./routes/busRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const detalleReservaRoutes = require('./routes/detalleReservaRoutes');

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
