const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// RUTAS ESPECÍFICAS PRIMERO
router.get('/reportes', reservaController.obtenerReporteReservas);
router.get('/bus/:id_bus/asientos-disponibles', reservaController.obtenerAsientosDisponibles);

// GENERALES
router.get('/', reservaController.obtenerReservas);
router.post('/', reservaController.crearReserva);

// DINÁMICAS AL FINAL
router.get('/:id', reservaController.obtenerReservaPorId);
router.put('/:id', reservaController.actualizarReserva);
router.delete('/:id', reservaController.eliminarReserva);

module.exports = router;

