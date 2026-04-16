module.exports = (req, res, next) => {
  if (!req.session.userId) {
    req.flash('error', 'Tu dois etre connecte pour acceder a cette page.');
    return res.redirect('/auth/login');
  }
  next();
};
