const db = require('../config/database');

// ===============================================
// OBTENER TODAS LAS CIUDADES
// ===============================================
const obtenerCiudades = async (req, res) => {
    try {
        const [ciudades] = await db.query('SELECT * FROM ciudad ORDER BY id_ciudad DESC');

        res.json({
            success: true,
            count: ciudades.length,
            data: ciudades
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener ciudades',
            error: error.message
        });
    }
};

// ===============================================
// OBTENER CIUDAD POR ID
// ===============================================
const obtenerCiudadPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [ciudad] = await db.query('SELECT * FROM ciudad WHERE id_ciudad = ?', [id]);

        if (ciudad.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Ciudad no encontrada'
            });
        }

        res.json({
            success: true,
            data: ciudad[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener ciudad',
            error: error.message
        });
    }
};

// ===============================================
// CREAR NUEVA CIUDAD
// ===============================================
const crearCiudad = async (req, res) => {
    try {
        const { nombre, estado } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                mensaje: 'El nombre de la ciudad es obligatorio'
            });
        }

        const [resultado] = await db.query(
            'INSERT INTO ciudad (nombre, estado) VALUES (?, ?)',
            [nombre, estado || 'ACTIVO']
        );

        res.status(201).json({
            success: true,
            mensaje: 'Ciudad creada exitosamente',
            data: {
                id_ciudad: resultado.insertId,
                nombre,
                estado: estado || 'ACTIVO'
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al crear ciudad',
            error: error.message
        });
    }
};

// ===============================================
// ACTUALIZAR CIUDAD
// ===============================================
const actualizarCiudad = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, estado } = req.body;

        const [existente] = await db.query('SELECT * FROM ciudad WHERE id_ciudad = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Ciudad no encontrada'
            });
        }

        await db.query(
            'UPDATE ciudad SET nombre = ?, estado = ? WHERE id_ciudad = ?',
            [nombre || existente[0].nombre, estado || existente[0].estado, id]
        );

        res.json({
            success: true,
            mensaje: 'Ciudad actualizada exitosamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar ciudad',
            error: error.message
        });
    }
};

// ===============================================
// ELIMINAR CIUDAD
// ===============================================
const eliminarCiudad = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query('SELECT * FROM ciudad WHERE id_ciudad = ?', [id]);

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Ciudad no encontrada'
            });
        }

        await db.query('DELETE FROM ciudad WHERE id_ciudad = ?', [id]);

        res.json({
            success: true,
            mensaje: 'Ciudad eliminada exitosamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar ciudad',
            error: error.message
        });
    }
};

module.exports = {
    obtenerCiudades,
    obtenerCiudadPorId,
    crearCiudad,
    actualizarCiudad,
    eliminarCiudad
};
