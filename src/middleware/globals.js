const User = require('../models/user');

module.exports = async (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.userId);
  res.locals.currentUser = null;

  if (req.session.userId) {
    try {
      res.locals.currentUser = await User.findById(req.session.userId).lean();
    } catch (e) {
      res.locals.currentUser = null;
    }
  }

  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  res.locals.validationErrors = req.flash('validationErrors');
  const formData = req.flash('formData');
  res.locals.formData = formData.length > 0 ? formData[0] : {};

  next();
};
