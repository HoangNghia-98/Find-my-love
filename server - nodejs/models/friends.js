const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  info:{type: Schema.Types.ObjectId, ref:'User'},
  isAccept:Boolean,
  isPendingRequest:Boolean,
  requestMessage:String,
  isSender:Boolean,
  isReceiver: Boolean,
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

module.exports = mongoose.model("Friends", UserSchema);
