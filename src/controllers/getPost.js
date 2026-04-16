const BlogPost = require('../models/blogPost');

module.exports = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('userId', 'username');
    if (!post) return next();
    res.render('post', { post });
  } catch (err) {
    return next();
  }
};
