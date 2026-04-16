const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Le nom d utilisateur est obligatoire.'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'L email est obligatoire.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'L email n est pas valide.'],
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire.'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caracteres.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
