const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    validate: {
      validator: function(value) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(value);
      },
      message: 'Password must be at least 6 characters long and contain at least one letter and one number.'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  avatar: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active',
  },
}, {
  timestamps: true,
});

userSchema.index({ email: 1 }, { unique: true });

userSchema.post('save', function (doc, next) {
  console.log('New user is created & saved:', doc);
  next();
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(new Error('Error hashing password'));
    }
  }
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else {
      throw new Error("Invalid password");
    }
  } else {
    throw new Error("Kindly register first");
  }
};

userSchema.methods.isAdmin = function () {
  return this.role === 'admin';
};

const User = mongoose.model('User', userSchema);

module.exports = User;
