const BlogPost = require('../models/blogPost');

module.exports = async (req, res) => {
  const posts = await BlogPost.find()
    .populate('userId', 'username')
    .sort({ datePosted: -1 });
  res.render('index', { posts });
};
