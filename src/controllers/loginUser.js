const User = require('../models/user');

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('validationErrors', ['Email et mot de passe sont obligatoires.']);
      req.flash('formData', { email });
      return res.redirect('/auth/login');
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.comparePassword(password))) {
      req.flash('validationErrors', ['Email ou mot de passe incorrect.']);
      req.flash('formData', { email });
      return res.redirect('/auth/login');
    }

    req.session.userId = user._id.toString();
    req.flash('success', 'Bonjour, ' + user.username + ' !');
    res.redirect('/');
  } catch (err) {
    console.error('Erreur connexion :', err.message);
    req.flash('error', 'Erreur serveur, reessaie.');
    res.redirect('/auth/login');
  }
};
