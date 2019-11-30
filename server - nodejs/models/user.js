const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  type:String,
  email: { type: String, unique: true, lowercase: true },
  displayName: String,
  password: { type: String },
  photoURL: String,
  image:String,
  listImage:[String],
  phoneNumber:String,
  active:{ type: Boolean, default: false },
  sex:{ type: String, default: "Không rõ"},
  date:String, 
  isOnline: Boolean,
  lastOnline: Date,
  likes:[{
    type: Schema.Types.ObjectId, ref:'User'
  }],
  friends:[{
    type:Schema.Types.ObjectId, ref: "Friends"
  }],
  support:[
    {
      type:Schema.Types.ObjectId, ref: "Support"
    }
  ],
  address: String,
  relationShip: String,
  job:String,
  relate_status:String,
  age:{ type: String, default: "18"},
  suitable:{
    relationShip: { type: String, default: "Hẹn hò"},
    sex:{ type: String, default: "Không rõ"},
    minAge: { type: String, default: "18"},
    maxAge: { type: String, default: "70"},
  },
  height:String,
  weight:String,
  religion:String,
  knowledge:String,
  smoke:String,
  callId:String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
