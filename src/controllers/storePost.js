const path = require('path');
const BlogPost = require('../models/blogPost');

module.exports = async (req, res) => {
  try {
    let imageName = null;

    if (req.files && req.files.image) {
      const image = req.files.image;
      imageName = Date.now() + '-' + image.name.replace(/\s+/g, '_');
      const uploadPath = path.join(__dirname, '..', '..', 'public', 'img', 'uploads', imageName);
      await image.mv(uploadPath);
    }

    await BlogPost.create({
      title: req.body.title,
      body: req.body.body,
      image: imageName,
      userId: req.session.userId,
    });

    req.flash('success', 'Post publié avec succès.');
    res.redirect('/');
  } catch (err) {
    console.error('Erreur création post :', err.message);
    const errors = err.errors
      ? Object.values(err.errors).map(e => e.message)
      : [err.message];
    req.flash('validationErrors', errors);
    req.flash('formData', req.body);
    res.redirect('/post/new');
  }
};
