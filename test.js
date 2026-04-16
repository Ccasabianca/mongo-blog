const mongoose = require('mongoose');
const BlogPost = require('./src/models/blogPost');

mongoose
  .connect('mongodb://localhost:27017/my_blog')
  .then(async () => {
    console.log('Connecté');

    const post = await BlogPost.create({
      title: 'Mon premier post',
      body: 'Premier post sur mon blog.',
    });
    console.log('Post créé :', post);

    const all = await BlogPost.find();
    console.log('Tous les posts (' + all.length + ') :', all);

    await mongoose.disconnect();
    console.log('Déconnecté');
  })
  .catch((err) => console.error('Erreur :', err.message));
