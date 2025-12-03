const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');

router.get('/', vendedorController.obtenerVendedores);
router.get('/:id', vendedorController.obtenerVendedorPorId);
router.post('/', vendedorController.crearVendedor);
router.put('/:id', vendedorController.actualizarVendedor);
router.delete('/:id', vendedorController.eliminarVendedor);

module.exports = router;
