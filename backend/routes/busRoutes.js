const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

router.get('/', busController.obtenerBuses);
router.get('/:id', busController.obtenerBusPorId);
router.get('/:id/asientos', busController.obtenerAsientosBus);
router.post('/', busController.crearBus);
router.put('/:id', busController.actualizarBus);
router.delete('/:id', busController.eliminarBus);

module.exports = router;
