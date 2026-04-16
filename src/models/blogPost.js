const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est obligatoire.'],
    trim: true,
  },
  body: {
    type: String,
    required: [true, 'Le contenu est obligatoire.'],
  },
  image: {
    type: String,
    required: [true, 'Une image est obligatoire.'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
