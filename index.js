require('dotenv').config({ quiet: true });

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');

const home = require('./src/controllers/home');
const about = require('./src/controllers/about');
const contact = require('./src/controllers/contact');
const newPost = require('./src/controllers/newPost');
const storePost = require('./src/controllers/storePost');
const getPost = require('./src/controllers/getPost');
const editPost = require('./src/controllers/editPost');
const updatePost = require('./src/controllers/updatePost');
const deletePost = require('./src/controllers/deletePost');
const newUser = require('./src/controllers/newUser');
const storeUser = require('./src/controllers/storeUser');
const login = require('./src/controllers/login');
const loginUser = require('./src/controllers/loginUser');
const logout = require('./src/controllers/logout');
const notFound = require('./src/controllers/notFound');

const auth = require('./src/middleware/auth');
const redirectIfAuth = require('./src/middleware/redirectIfAuth');
const validatePost = require('./src/middleware/validatePost');
const globals = require('./src/middleware/globals');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/my_blog';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-me';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => console.error('Erreur MongoDB :', err.message));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);
app.use(flash());

app.use(globals);

app.get('/', home);
app.get('/about', about);
app.get('/contact', contact);

app.get('/auth/register', redirectIfAuth, newUser);
app.post('/users/register', redirectIfAuth, storeUser);
app.get('/auth/login', redirectIfAuth, login);
app.post('/users/login', redirectIfAuth, loginUser);
app.get('/auth/logout', logout);

app.get('/post/new', auth, newPost);
app.post('/post/store', auth, validatePost, storePost);
app.get('/post/:id/edit', auth, editPost);
app.post('/post/:id/update', auth, validatePost, updatePost);
app.post('/post/:id/delete', auth, deletePost);
app.get('/post/:id', getPost);

app.use(notFound);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
