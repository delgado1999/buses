const db = require('../config/database');

// ===============================================
// OBTENER TODOS LOS VENDEDORES
// ===============================================
const obtenerVendedores = async (req, res) => {
    try {
        const [vendedores] = await db.query(
            'SELECT * FROM vendedor ORDER BY id_vendedor DESC'
        );

        res.json({
            success: true,
            count: vendedores.length,
            data: vendedores
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener vendedores',
            error: error.message
        });
    }
};

// ===============================================
// OBTENER VENDEDOR POR ID
// ===============================================
const obtenerVendedorPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [vendedor] = await db.query(
            'SELECT * FROM vendedor WHERE id_vendedor = ?',
            [id]
        );

        if (vendedor.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Vendedor no encontrado'
            });
        }

        res.json({
            success: true,
            data: vendedor[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener vendedor',
            error: error.message
        });
    }
};

// ===============================================
// CREAR NUEVO VENDEDOR
// ===============================================
const crearVendedor = async (req, res) => {
    try {
        const { nombres, apellidos, usuario, password } = req.body;

        if (!nombres || !apellidos || !usuario || !password) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const [resultado] = await db.query(
            `INSERT INTO vendedor 
             (nombres, apellidos, usuario, password)
             VALUES (?, ?, ?, MD5(?))`,
            [nombres, apellidos, usuario, password]
        );

        res.status(201).json({
            success: true,
            mensaje: 'Vendedor creado exitosamente',
            data: {
                id_vendedor: resultado.insertId,
                nombres,
                apellidos,
                usuario
            }
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                mensaje: 'El usuario ya está registrado',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            mensaje: 'Error al crear vendedor',
            error: error.message
        });
    }
};

// ===============================================
// ACTUALIZAR VENDEDOR
// ===============================================
const actualizarVendedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, usuario, password, estado } = req.body;

        // verificar si existe
        const [existente] = await db.query(
            'SELECT * FROM vendedor WHERE id_vendedor = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Vendedor no encontrado'
            });
        }

        // Construimos UPDATE dinámico
        let campos = [];
        let valores = [];

        if (nombres) { campos.push("nombres = ?"); valores.push(nombres); }
        if (apellidos) { campos.push("apellidos = ?"); valores.push(apellidos); }
        if (usuario) { campos.push("usuario = ?"); valores.push(usuario); }
        if (estado) { campos.push("estado = ?"); valores.push(estado); }
        if (password) { 
            campos.push("password = MD5(?)");
            valores.push(password); 
        }

        // Si no mandan ningún dato actualizable
        if (campos.length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'No se envió ningún dato para actualizar'
            });
        }

        const sql = `UPDATE vendedor SET ${campos.join(', ')} WHERE id_vendedor = ?`;
        valores.push(id);

        await db.query(sql, valores);

        res.json({
            success: true,
            mensaje: 'Vendedor actualizado exitosamente'
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                mensaje: 'El usuario ya está registrado',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar vendedor',
            error: error.message
        });
    }
};

// ===============================================
// ELIMINAR VENDEDOR
// ===============================================
const eliminarVendedor = async (req, res) => {
    try {
        const { id } = req.params;

        const [existente] = await db.query(
            'SELECT * FROM vendedor WHERE id_vendedor = ?',
            [id]
        );

        if (existente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Vendedor no encontrado'
            });
        }

        await db.query('DELETE FROM vendedor WHERE id_vendedor = ?', [id]);

        res.json({
            success: true,
            mensaje: 'Vendedor eliminado exitosamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar vendedor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerVendedores,
    obtenerVendedorPorId,
    crearVendedor,
    actualizarVendedor,
    eliminarVendedor
};
