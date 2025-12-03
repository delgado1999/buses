const express = require('express');
const router = express.Router();
const detalleController = require('../controllers/detalleReservaController');

router.get('/', detalleController.obtenerDetallesReserva);
router.get('/:id', detalleController.obtenerDetallePorId);
router.post('/', detalleController.crearDetalleReserva);
router.put('/:id', detalleController.actualizarDetalleReserva);
router.delete('/:id', detalleController.eliminarDetalleReserva);

module.exports = router;
