const db = require('../config/database');

// ===============================================
// OBTENER TODOS LOS DETALLES DE RESERVA
// ===============================================
const obtenerDetallesReserva = async (req, res) => {
    try {
        const [detalles] = await db.query(
            'SELECT * FROM detalle_reserva ORDER BY id_detalle DESC'
        );

        res.json({
            success: true,
            count: detalles.length,
            data: detalles
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener detalles',
            error: error.message
        });
    }
};

// ===============================================
// OBTENER DETALLE POR ID
// ===============================================
const obtenerDetallePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [detalle] = await db.query(
            'SELECT * FROM detalle_reserva WHERE id_detalle = ?',
            [id]
        );

        if (detalle.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Detalle no encontrado'
            });
        }

        res.json({
            success: true,
            data: detalle[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener detalle',
            error: error.message
        });
    }
};

// ===============================================
// CREAR DETALLE DE RESERVA
// ===============================================
const crearDetalleReserva = async (req, res) => {
    try {
        const { id_reserva, nro_asiento, precio } = req.body;

        if (!id_reserva || !nro_asiento || !precio) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO detalle_reserva (id_reserva, nro_asiento, precio)
             VALUES (?, ?, ?)`,
            [id_reserva, nro_asiento, precio]
        );

        res.status(201).json({
            success: true,
            mensaje: 'Detalle creado exitosamente',
            data: {
                id_detalle: resultado.insertId,
                id_reserva,
                nro_asiento,
                precio
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al crear detalle',
            error: error.message
        });
    }
};

// ===============================================
// ACTUALIZAR DETALLE
// ===============================================
const actualizarDetalleReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_reserva, nro_asiento, precio } = req.body;

        const [existente] = await db.query(
            'SELECT * FROM detalle_reserva WHERE id_detalle = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Detalle no encontrado'
            });
        }

        let campos = [];
        let valores = [];

        if (id_reserva) { campos.push("id_reserva = ?"); valores.push(id_reserva); }
        if (nro_asiento) { campos.push("nro_asiento = ?"); valores.push(nro_asiento); }
        if (precio) { campos.push("precio = ?"); valores.push(precio); }

        if (campos.length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'No se envió ningún dato para actualizar'
            });
        }

        const sql = `UPDATE detalle_reserva SET ${campos.join(', ')} WHERE id_detalle = ?`;
        valores.push(id);

        await db.query(sql, valores);

        res.json({
            success: true,
            mensaje: 'Detalle actualizado exitosamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar detalle',
            error: error.message
        });
    }
};

// ===============================================
// ELIMINAR DETALLE
// ===============================================
const eliminarDetalleReserva = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query(
            'SELECT * FROM detalle_reserva WHERE id_detalle = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Detalle no encontrado'
            });
        }

        await db.query('DELETE FROM detalle_reserva WHERE id_detalle = ?', [id]);

        res.json({
            success: true,
            mensaje: 'Detalle eliminado exitosamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar detalle',
            error: error.message
        });
    }
};

module.exports = {
    obtenerDetallesReserva,
    obtenerDetallePorId,
    crearDetalleReserva,
    actualizarDetalleReserva,
    eliminarDetalleReserva
};
