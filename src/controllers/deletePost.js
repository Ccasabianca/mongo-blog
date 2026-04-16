const path = require('path');
const fs = require('fs');
const BlogPost = require('../models/blogPost');

module.exports = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return next();

    if (!post.userId || post.userId.toString() !== req.session.userId) {
      req.flash('error', 'Vous ne pouvez supprimer que vos propres posts.');
      return res.redirect('/post/' + post._id);
    }

    if (post.image) {
      const imagePath = path.join(__dirname, '..', '..', 'public', 'img', 'uploads', post.image);
      fs.unlink(imagePath, () => {});
    }

    await post.deleteOne();
    req.flash('success', 'Post supprimé.');
    res.redirect('/');
  } catch (err) {
    console.error('Erreur suppression post :', err.message);
    req.flash('error', 'Impossible de supprimer le post.');
    res.redirect('/');
  }
};
