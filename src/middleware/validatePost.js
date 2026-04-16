module.exports = (req, res, next) => {
  const { title, body } = req.body;
  const errors = [];
  const isUpdate = Boolean(req.params.id);

  if (!title || title.trim() === '') errors.push('Le titre est obligatoire.');
  if (!body || body.trim() === '') errors.push('Le contenu est obligatoire.');
  if (!isUpdate && (!req.files || !req.files.image)) {
    errors.push('Une image est obligatoire.');
  }

  if (errors.length > 0) {
    req.flash('validationErrors', errors);
    req.flash('formData', req.body);
    const backUrl = isUpdate ? '/post/' + req.params.id + '/edit' : '/post/new';
    return res.redirect(backUrl);
  }
  next();
};
