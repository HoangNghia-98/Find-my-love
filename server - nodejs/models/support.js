const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SupportSchema = new Schema({
  support:{type: Schema.Types.ObjectId, ref:'User'},
  users:[{type: Schema.Types.ObjectId, ref:'User'}],
  contents: [
    {
      message: {
        type: String
      },
      from: {
        type: String
      },
      createAt: {
        type: Date, default: Date.now
      }
    }
  ],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Support", SupportSchema);
