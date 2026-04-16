const User = require('../models/user');

module.exports = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    req.session.userId = user._id.toString();
    req.flash('success', 'Bienvenue ' + user.username + ' !');
    res.redirect('/');
  } catch (err) {
    console.error('Erreur inscription :', err.message);

    let errors = [];

    if (err.name === 'ValidationError') {
      errors = Object.values(err.errors).map((e) => e.message);
    }
    else if (err.code === 11000 && err.keyPattern) {
      const field = Object.keys(err.keyPattern)[0];
      errors.push(
        field === 'email'
          ? 'Cet email est deja utilise.'
          : 'Ce nom d utilisateur est deja pris.'
      );
    }
    else {
      errors.push(err.message);
    }

    req.flash('validationErrors', errors);
    req.flash('formData', { username: req.body.username, email: req.body.email });
    res.redirect('/auth/register');
  }
};
