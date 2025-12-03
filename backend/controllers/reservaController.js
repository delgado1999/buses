const db = require('../config/database');

// ===============================================
// OBTENER TODAS LAS RESERVAS
// ===============================================
const obtenerReservas = async (req, res) => {
    try {
        const [reservas] = await db.query(`
            SELECT * FROM reserva ORDER BY id_reserva DESC
        `);

        res.json({
            success: true,
            count: reservas.length,
            data: reservas
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener reservas',
            error: error.message
        });
    }
};

// ===============================================
// OBTENER RESERVA POR ID
// ===============================================
const obtenerReservaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [reserva] = await db.query(
            'SELECT * FROM reserva WHERE id_reserva = ?',
            [id]
        );

        if (reserva.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Reserva no encontrada'
            });
        }

        res.json({
            success: true,
            data: reserva[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener reserva',
            error: error.message
        });
    }
};

// ===============================================
// CREAR NUEVA RESERVA
// ===============================================
const crearReserva = async (req, res) => {
    try {
        const {
            codigo_reserva,
            fecha_reserva,
            id_cliente,
            id_vendedor,
            id_bus,
            id_ciudad_origen,
            id_ciudad_destino,
            monto_total,
            estado
        } = req.body;

        if (
            !codigo_reserva || !fecha_reserva || !id_cliente || !id_vendedor ||
            !id_bus || !id_ciudad_origen || !id_ciudad_destino || !monto_total
        ) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO reserva 
            (codigo_reserva, fecha_reserva, id_cliente, id_vendedor, id_bus,
             id_ciudad_origen, id_ciudad_destino, monto_total, estado)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                codigo_reserva,
                fecha_reserva,
                id_cliente,
                id_vendedor,
                id_bus,
                id_ciudad_origen,
                id_ciudad_destino,
                monto_total,
                estado || 'PENDIENTE'
            ]
        );

        res.status(201).json({
            success: true,
            mensaje: 'Reserva creada correctamente',
            data: {
                id_reserva: resultado.insertId,
                codigo_reserva,
                fecha_reserva,
                id_cliente,
                id_vendedor,
                id_bus,
                id_ciudad_origen,
                id_ciudad_destino,
                monto_total,
                estado: estado || 'PENDIENTE'
            }
        });

    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                mensaje: 'El código de reserva ya existe',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            mensaje: 'Error al crear reserva',
            error: error.message
        });
    }
};

// ===============================================
// ACTUALIZAR RESERVA
// ===============================================
const actualizarReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            codigo_reserva,
            fecha_reserva,
            id_cliente,
            id_vendedor,
            id_bus,
            id_ciudad_origen,
            id_ciudad_destino,
            monto_total,
            estado
        } = req.body;

        const [existente] = await db.query(
            'SELECT * FROM reserva WHERE id_reserva = ?', [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Reserva no encontrada'
            });
        }

        // Construir UPDATE dinámico
        let campos = [];
        let valores = [];

        if (codigo_reserva) { campos.push("codigo_reserva = ?"); valores.push(codigo_reserva); }
        if (fecha_reserva) { campos.push("fecha_reserva = ?"); valores.push(fecha_reserva); }
        if (id_cliente) { campos.push("id_cliente = ?"); valores.push(id_cliente); }
        if (id_vendedor) { campos.push("id_vendedor = ?"); valores.push(id_vendedor); }
        if (id_bus) { campos.push("id_bus = ?"); valores.push(id_bus); }
        if (id_ciudad_origen) { campos.push("id_ciudad_origen = ?"); valores.push(id_ciudad_origen); }
        if (id_ciudad_destino) { campos.push("id_ciudad_destino = ?"); valores.push(id_ciudad_destino); }
        if (monto_total) { campos.push("monto_total = ?"); valores.push(monto_total); }
        if (estado) { campos.push("estado = ?"); valores.push(estado); }

        if (campos.length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'No se envió ningún dato para actualizar'
            });
        }

        const sql = `UPDATE reserva SET ${campos.join(', ')} WHERE id_reserva = ?`;
        valores.push(id);

        await db.query(sql, valores);

        res.json({
            success: true,
            mensaje: 'Reserva actualizada correctamente'
        });

    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                mensaje: 'El código de reserva ya está registrado',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar reserva',
            error: error.message
        });
    }
};

// ===============================================
// ELIMINAR RESERVA
// ===============================================
const eliminarReserva = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query(
            'SELECT * FROM reserva WHERE id_reserva = ?', [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Reserva no encontrada'
            });
        }

        await db.query('DELETE FROM reserva WHERE id_reserva = ?', [id]);

        res.json({
            success: true,
            mensaje: 'Reserva eliminada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar reserva',
            error: error.message
        });
    }
};

module.exports = {
    obtenerReservas,
    obtenerReservaPorId,
    crearReserva,
    actualizarReserva,
    eliminarReserva
};
