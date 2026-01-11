const db = require('../config/database');

const obtenerBuses = async (req, res) => {
    try {
        const [buses] = await db.query(
            'SELECT * FROM bus ORDER BY id_bus DESC'
        );

        res.json({
            success: true,
            count: buses.length,
            data: buses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener buses',
            error: error.message
        });
    }
};

const obtenerBusPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [bus] = await db.query(
            'SELECT * FROM bus WHERE id_bus = ?',
            [id]
        );

        if (bus.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Bus no encontrado'
            });
        }

        res.json({
            success: true,
            data: bus[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener bus',
            error: error.message
        });
    }
};

const crearBus = async (req, res) => {
    try {
        const { placa, modelo, nro_asientos, estado } = req.body;

        if (!placa || !nro_asientos) {
            return res.status(400).json({
                success: false,
                mensaje: 'Los campos placa y nro_asientos son obligatorios'
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO bus 
            (placa, modelo, nro_asientos, estado) 
            VALUES (?, ?, ?, ?)`,
            [placa, modelo || null, nro_asientos, estado || 'ACTIVO']
        );

        res.status(201).json({
            success: true,
            mensaje: 'Bus creado correctamente',
            data: {
                id_bus: resultado.insertId,
                placa,
                modelo,
                nro_asientos,
                estado: estado || 'ACTIVO'
            }
        });

    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                mensaje: 'La placa ya está registrada',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            mensaje: 'Error al crear bus',
            error: error.message
        });
    }
};
const actualizarBus = async (req, res) => {
    try {
        const { id } = req.params;
        const { placa, modelo, nro_asientos, estado } = req.body;

        const [existente] = await db.query(
            'SELECT * FROM bus WHERE id_bus = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Bus no encontrado'
            });
        }

        // UPDATE dinámico
        let campos = [];
        let valores = [];

        if (placa) { campos.push("placa = ?"); valores.push(placa); }
        if (modelo) { campos.push("modelo = ?"); valores.push(modelo); }
        if (nro_asientos) { campos.push("nro_asientos = ?"); valores.push(nro_asientos); }
        if (estado) { campos.push("estado = ?"); valores.push(estado); }

        if (campos.length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'No se envió ningún dato para actualizar'
            });
        }

        const sql = `UPDATE bus SET ${campos.join(', ')} WHERE id_bus = ?`;
        valores.push(id);

        await db.query(sql, valores);

        res.json({
            success: true,
            mensaje: 'Bus actualizado correctamente'
        });

    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                mensaje: 'La placa ya está registrada',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar bus',
            error: error.message
        });
    }
};

const eliminarBus = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query(
            'SELECT * FROM bus WHERE id_bus = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Bus no encontrado'
            });
        }

        await db.query('DELETE FROM bus WHERE id_bus = ?', [id]);

        res.json({
            success: true,
            mensaje: 'Bus eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar bus',
            error: error.message
        });
    }
};
const obtenerAsientosBus = async (req, res) => {
    try {
        const { id } = req.params; // id del bus

        // 1. Obtener el total de asientos del bus
        const [bus] = await db.query(
            'SELECT nro_asientos FROM bus WHERE id_bus = ?',
            [id]
        );

        if (bus.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Bus no encontrado'
            });
        }

        const totalAsientos = bus[0].nro_asientos;

        // 2. Obtener los asientos ya reservados (CONFIRMADA o PENDIENTE)
        const [ocupados] = await db.query(
            `SELECT dr.nro_asiento
             FROM detalle_reserva dr
             JOIN reserva r ON dr.id_reserva = r.id_reserva
             WHERE r.id_bus = ? AND r.estado IN ('CONFIRMADA', 'PENDIENTE')`,
            [id]
        );

        // Convertir a array de números
        const asientosOcupados = ocupados.map(a => a.nro_asiento);

        // 3. Responder
        res.json({
            success: true,
            totalAsientos,
            ocupados: asientosOcupados
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener asientos del bus',
            error: error.message
        });
    }
};


module.exports = {
    obtenerBuses,
    obtenerBusPorId,
    crearBus,
    actualizarBus,
    eliminarBus,
    obtenerAsientosBus
};
