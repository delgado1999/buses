const express = require('express');
const router = express.Router();
const {
    obtenerCiudades,
    obtenerCiudadPorId,
    crearCiudad,
    actualizarCiudad,
    eliminarCiudad
} = require('../controllers/ciudad.controller');

router.get('/', obtenerCiudades);
router.get('/:id', obtenerCiudadPorId);
router.post('/', crearCiudad);
router.put('/:id', actualizarCiudad);
router.delete('/:id', eliminarCiudad);

module.exports = router;
