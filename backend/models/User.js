const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    minlength: 3, 
    maxlength: 60 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] 
  },
  address: { 
    type: String, 
    maxlength: 400 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  role: { 
    type: String, 
    enum: ['admin', 'user', 'owner'], 
    default: 'user' 
  }
}, { timestamps: true }); // adds createdAt & updatedAt automatically

module.exports = mongoose.model('User', UserSchema);
