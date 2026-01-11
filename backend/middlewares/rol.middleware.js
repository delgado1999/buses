exports.esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'ADMIN') {
    return res.status(403).json({ msg: 'Acceso solo admin' });
  }
  next();
};
