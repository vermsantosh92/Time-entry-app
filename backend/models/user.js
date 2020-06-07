const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require('bcryptjs');


const userSchema = mongoose.Schema({
  email:
  {
     type: String,
      required: true,
      unique: true
     },
  password:
  {
     type: String,
      required: true
    }
});

// userSchema.plugin(uniqueValidator);

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

module.exports = mongoose.model("User", userSchema);
