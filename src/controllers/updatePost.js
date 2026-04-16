const path = require('path');
const fs = require('fs');
const BlogPost = require('../models/blogPost');

module.exports = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return next();

    if (!post.userId || post.userId.toString() !== req.session.userId) {
      req.flash('error', 'Vous ne pouvez modifier que vos propres posts.');
      return res.redirect('/post/' + post._id);
    }

    post.title = req.body.title;
    post.body = req.body.body;

    if (req.files && req.files.image) {
      if (post.image) {
        const oldPath = path.join(__dirname, '..', '..', 'public', 'img', 'uploads', post.image);
        fs.unlink(oldPath, () => {});
      }
      const image = req.files.image;
      const imageName = Date.now() + '-' + image.name.replace(/\s+/g, '_');
      const uploadPath = path.join(__dirname, '..', '..', 'public', 'img', 'uploads', imageName);
      await image.mv(uploadPath);
      post.image = imageName;
    }

    await post.save();
    req.flash('success', 'Post mis à jour.');
    res.redirect('/post/' + post._id);
  } catch (err) {
    console.error('Erreur mise à jour post :', err.message);
    const errors = err.errors
      ? Object.values(err.errors).map(e => e.message)
      : [err.message];
    req.flash('validationErrors', errors);
    req.flash('formData', req.body);
    res.redirect('/post/' + req.params.id + '/edit');
  }
};
