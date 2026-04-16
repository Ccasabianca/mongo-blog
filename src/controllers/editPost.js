const BlogPost = require('../models/blogPost');

module.exports = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return next();

    if (!post.userId || post.userId.toString() !== req.session.userId) {
      req.flash('error', 'Vous ne pouvez modifier que vos propres posts.');
      return res.redirect('/post/' + post._id);
    }

    res.render('edit', { post });
  } catch (err) {
    return next();
  }
};
