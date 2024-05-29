const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
});
let User = mongoose.model("User", userSchema);
module.exports = User;