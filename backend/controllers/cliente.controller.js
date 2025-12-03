const db = require('../config/database');

// ===============================================
// OBTENER TODOS LOS CLIENTES
// ===============================================
const obtenerClientes = async (req, res) => {
    try {
        const [clientes] = await db.query('SELECT * FROM cliente ORDER BY id_cliente DESC');

        res.json({
            success: true,
            count: clientes.length,
            data: clientes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener clientes',
            error: error.message
        });
    }
};

// ===============================================
// OBTENER CLIENTE POR ID
// ===============================================
const obtenerClientePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [cliente] = await db.query(
            'SELECT * FROM cliente WHERE id_cliente = ?',
            [id]
        );

        if (cliente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Cliente no encontrado'
            });
        }

        res.json({
            success: true,
            data: cliente[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener cliente',
            error: error.message
        });
    }
};

// ===============================================
// CREAR NUEVO CLIENTE
// ===============================================
const crearCliente = async (req, res) => {
    try {
        // usa los nombres que realmente tienes en la BD
        const { nombres, apellidos, dni, telefono, correo, id_ciudad } = req.body;

        if (!nombres || !apellidos || !dni) {
            return res.status(400).json({
                success: false,
                mensaje: 'Nombres, apellidos y DNI son obligatorios'
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO cliente 
            (nombres, apellidos, dni, telefono, correo, id_ciudad) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [nombres, apellidos, dni, telefono || null, correo || null, id_ciudad || null]
        );

        res.status(201).json({
            success: true,
            mensaje: 'Cliente creado exitosamente',
            data: {
                id_cliente: resultado.insertId,
                nombres,
                apellidos,
                dni,
                telefono,
                correo,
                id_ciudad
            }
        });

    } catch (error) {
        // maneja duplicado de dni (código SQLSTATE 23000 -> ER_DUP_ENTRY)
        if (error && error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                mensaje: 'DNI ya registrado',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            mensaje: 'Error al crear cliente',
            error: error.message
        });
    }
};

// ===============================================
// ACTUALIZAR CLIENTE
// ===============================================
const actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, dni, telefono, correo, id_ciudad } = req.body;

        const [existente] = await db.query(
            'SELECT * FROM cliente WHERE id_cliente = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Cliente no encontrado'
            });
        }

        await db.query(
            `UPDATE cliente SET 
                nombres = ?, 
                apellidos = ?, 
                dni = ?, 
                telefono = ?, 
                correo = ?,
                id_ciudad = ?
            WHERE id_cliente = ?`,
            [
                nombres || existente[0].nombres,
                apellidos || existente[0].apellidos,
                dni || existente[0].dni,
                telefono || existente[0].telefono,
                correo || existente[0].correo,
                id_ciudad || existente[0].id_ciudad,
                id
            ]
        );

        res.json({
            success: true,
            mensaje: 'Cliente actualizado exitosamente'
        });

    } catch (error) {
        if (error && error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                mensaje: 'DNI ya registrado por otro cliente',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar cliente',
            error: error.message
        });
    }
};

// ===============================================
// ELIMINAR CLIENTE
// ===============================================
const eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query(
            'SELECT * FROM cliente WHERE id_cliente = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Cliente no encontrado'
            });
        }

        await db.query('DELETE FROM cliente WHERE id_cliente = ?', [id]);

        res.json({
            success: true,
            mensaje: 'Cliente eliminado exitosamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar cliente',
            error: error.message
        });
    }
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};
