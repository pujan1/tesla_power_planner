const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    language: {
      type: String,
      default: 'en',
    },
    theme: {
      type: String,
      default: 'dark',
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt tracking organically
  }
);

// Mongoose internally manages "id". We can inject a transform to make it cleaner locally parsing.
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
