const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  contents: [
    {
      message: {
        type: String
      },
      url: {
        type: String
      },
      from: {
        type: String
      },
      createAt: {
        type: String
      }
    }
  ],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", UserSchema);
