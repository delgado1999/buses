const db = require('../config/database');

const obtenerReservas = async (req, res) => {
  try {
    const [reservas] = await db.query(`
      SELECT 
        r.id_reserva,
        r.codigo_reserva,
        r.fecha_reserva,
        r.monto_total,
        r.estado,

        -- NOMBRES
        CONCAT(c.nombres, ' ', c.apellidos) AS cliente,
        CONCAT(v.nombres, ' ', v.apellidos) AS vendedor,
        CONCAT(b.placa, ' - ', b.modelo) AS bus,
        co.nombre AS ciudad_origen,
        cd.nombre AS ciudad_destino

      FROM reserva r
      JOIN cliente c ON r.id_cliente = c.id_cliente
      JOIN vendedor v ON r.id_vendedor = v.id_vendedor
      JOIN bus b ON r.id_bus = b.id_bus
      JOIN ciudad co ON r.id_ciudad_origen = co.id_ciudad
      JOIN ciudad cd ON r.id_ciudad_destino = cd.id_ciudad

      ORDER BY r.id_reserva DESC
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

const crearReserva = async (req, res) => {
    const connection = await db.getConnection();

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
            estado,
            asientos = []
        } = req.body;

        // -----------------------------
        // Validaciones básicas
        // -----------------------------
        if (!codigo_reserva || !fecha_reserva || !id_cliente || !id_vendedor ||
            !id_bus || !id_ciudad_origen || !id_ciudad_destino || !monto_total) {
            return res.status(400).json({
                success: false,
                mensaje: 'Datos incompletos'
            });
        }

        // -----------------------------
        // INICIAR TRANSACCIÓN
        // -----------------------------
        await connection.beginTransaction();

        // -----------------------------
        // Insertar reserva
        // -----------------------------
        const [resultado] = await connection.query(
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

        const id_reserva = resultado.insertId;

        // -----------------------------
        // Insertar asientos (detalle_reserva)
        // -----------------------------
        if (Array.isArray(asientos) && asientos.length > 0) {

            const precioAsiento = monto_total / asientos.length;

            const valores = asientos.map(nro => [
                id_reserva,
                id_bus,
                nro,
                precioAsiento
            ]);

            await connection.query(
                `INSERT INTO detalle_reserva 
                 (id_reserva, id_bus, nro_asiento, precio) 
                 VALUES ?`,
                [valores]
            );
        }

        // -----------------------------
        // CONFIRMAR TRANSACCIÓN
        // -----------------------------
        await connection.commit();

        res.status(201).json({
            success: true,
            mensaje: 'Reserva creada correctamente',
            data: {
                id_reserva,
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
        // -----------------------------
        // ROLLBACK si algo falla
        // -----------------------------
        await connection.rollback();

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                mensaje: 'El código de reserva ya existe'
            });
        }

        res.status(500).json({
            success: false,
            mensaje: 'Error al crear reserva',
            error: error.message
        });

    } finally {
        connection.release();
    }
};


// ===============================================
// ACTUALIZAR RESERVA
// ===============================================
const actualizarReserva = async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

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
            estado,
            asientos
        } = req.body;

        // Verificar que la reserva exista
        const [existente] = await connection.query(
            'SELECT * FROM reserva WHERE id_reserva = ?', [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Reserva no encontrada'
            });
        }

        // -----------------------------
        // Actualizar la tabla reserva
        // -----------------------------
        let campos = [];
        let valores = [];

        if (codigo_reserva !== undefined) { campos.push("codigo_reserva = ?"); valores.push(codigo_reserva); }
        if (fecha_reserva !== undefined) { campos.push("fecha_reserva = ?"); valores.push(fecha_reserva); }
        if (id_cliente !== undefined) { campos.push("id_cliente = ?"); valores.push(id_cliente); }
        if (id_vendedor !== undefined) { campos.push("id_vendedor = ?"); valores.push(id_vendedor); }
        if (id_bus !== undefined) { campos.push("id_bus = ?"); valores.push(id_bus); }
        if (id_ciudad_origen !== undefined) { campos.push("id_ciudad_origen = ?"); valores.push(id_ciudad_origen); }
        if (id_ciudad_destino !== undefined) { campos.push("id_ciudad_destino = ?"); valores.push(id_ciudad_destino); }
        if (monto_total !== undefined) { campos.push("monto_total = ?"); valores.push(monto_total); }
        if (estado !== undefined) { campos.push("estado = ?"); valores.push(estado); }

        if (campos.length > 0) {
            const sql = `UPDATE reserva SET ${campos.join(', ')} WHERE id_reserva = ?`;
            valores.push(id);
            await connection.query(sql, valores);
        }

        // -----------------------------
        // Actualizar los asientos
        // -----------------------------
        if (Array.isArray(asientos)) {
            await connection.query(
                'DELETE FROM detalle_reserva WHERE id_reserva = ?', [id]
            );

            if (asientos.length > 0) {
                const bus_id = id_bus ?? existente[0].id_bus;
                const values = asientos.map(nro => [id, bus_id, nro]);

                await connection.query(
                    'INSERT INTO detalle_reserva (id_reserva, id_bus, nro_asiento) VALUES ?',
                    [values]
                );
            }
        }

        await connection.commit();

        res.json({
            success: true,
            mensaje: 'Reserva actualizada correctamente'
        });

    } catch (error) {
        await connection.rollback();

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                mensaje: 'El código de reserva ya está registrado'
            });
        }

        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar reserva',
            error: error.message
        });
    } finally {
        connection.release();
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
// Endpoint para consultar asientos disponibles de un bus
const obtenerAsientosDisponibles = async (req, res) => {
    try {
        const { id_bus } = req.params; 
        const disponibles = await asientosDisponibles(id_bus); // <-- necesita la función definida abajo
        res.json({
            success: true,
            id_bus,
            disponibles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al consultar asientos',
            error: error.message
        });
    }
};
// Función para calcular los asientos disponibles de un bus
const asientosDisponibles = async (id_bus) => {
    const [[bus]] = await db.query('SELECT nro_asientos FROM bus WHERE id_bus = ?', [id_bus]);
    const [ocupados] = await db.query('SELECT COUNT(*) AS total FROM detalle_reserva WHERE id_bus = ?', [id_bus]);
    return bus.nro_asientos - (ocupados[0]?.total || 0);
};
// Obtener reporte de reservas con filtros opcionales: cliente, fecha inicio/fin, estado
const obtenerReporteReservas = async (req, res) => {
    try {
        const { clienteId, fechaInicio, fechaFin, estado } = req.query;

        let filtros = [];
        let valores = [];

        if (clienteId) {
            filtros.push("r.id_cliente = ?");
            valores.push(clienteId);
        }
        if (estado) {
            filtros.push("r.estado = ?");
            valores.push(estado);
        }
        if (fechaInicio) {
            filtros.push("r.fecha_reserva >= ?");
            valores.push(fechaInicio);
        }
        if (fechaFin) {
            filtros.push("r.fecha_reserva <= ?");
            valores.push(fechaFin);
        }

        let where = filtros.length > 0 ? `WHERE ${filtros.join(" AND ")}` : "";

        const [reservas] = await db.query(`
            SELECT r.id_reserva, r.codigo_reserva, r.fecha_reserva, r.monto_total, r.estado,
                   c.nombres AS cliente_nombres, c.apellidos AS cliente_apellidos,
                   v.nombres AS vendedor_nombres, v.apellidos AS vendedor_apellidos,
                   b.placa AS bus_placa, b.modelo AS bus_modelo,
                   co.nombre AS ciudad_origen,
                   cd.nombre AS ciudad_destino
            FROM reserva r
            INNER JOIN cliente c ON r.id_cliente = c.id_cliente
            INNER JOIN vendedor v ON r.id_vendedor = v.id_vendedor
            INNER JOIN bus b ON r.id_bus = b.id_bus
            INNER JOIN ciudad co ON r.id_ciudad_origen = co.id_ciudad
            INNER JOIN ciudad cd ON r.id_ciudad_destino = cd.id_ciudad
            ${where}
            ORDER BY r.fecha_reserva DESC
        `, valores);

        // Traer los asientos por reserva
        for (let resv of reservas) {
            const [asientos] = await db.query(`
                SELECT nro_asiento, precio
                FROM detalle_reserva
                WHERE id_reserva = ?
            `, [resv.id_reserva]);
            resv.asientos = asientos;
        }

        res.json({
            success: true,
            reservas
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener reporte',
            error: error.message
        });
    }
};


module.exports = {
    obtenerReporteReservas,
    obtenerReservas,
    obtenerReservaPorId,
    crearReserva,
    actualizarReserva,
    eliminarReserva,
    obtenerAsientosDisponibles,
    asientosDisponibles
};
