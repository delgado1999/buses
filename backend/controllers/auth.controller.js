const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Datos incompletos' });
  }

  const [rows] = await db.query(
    'SELECT * FROM usuarios WHERE email = ? AND estado = "ACTIVO"',
    [email]
  );

  if (rows.length === 0) {
    return res.status(401).json({ msg: 'Usuario no existe' });
  }

  const usuario = rows[0];

  const valido = await bcrypt.compare(password, usuario.password);
  if (!valido) {
    return res.status(401).json({ msg: 'Contraseña incorrecta' });
  }

  // 🔐 TOKEN CON ROL
  const token = jwt.sign(
    {
      id: usuario.id_usuario,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    token,
    usuario: {
      id: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol
    }
  });
};
