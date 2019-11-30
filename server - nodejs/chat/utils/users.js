var async = require('asyncawait/async');
var await = require('asyncawait/await');
const Friend = require("../../models/friends");
const User = require("../../models/user");
const Support = require("../../models/support");
const { ObjectID } = require("mongodb");
var meFriend, friendFriend;
var me;
var support;
var login = (email)=>{
    User.findOne({ email }, (err, user) => {
      if (user) {
        me = user
        user.isOnline = true
        user.save()
        return {
          success: true
        } 
      } else {
        return{
          success: false,
          message: "user not found"
        }
      }
    });

 
}
var logout = ()=>{
  console.log( 'me',me)
    if(me){
      me.isOnline = false
      me.lastOnline = new Date()
      me.save()
    }
 
  console.log( 'logout')
  
 
}
var getInfo = async (me, friend) => {
  try {
    let users = await User.find({}).populate({
      path: 'friends',
      populate: {
        path: 'info'
      }
    })
    users.forEach(user => {
      let friends = []
      if (user.email == me) {
        friends = user.friends
        if (friends.length > 0) {
          friends.forEach(el => {
            if (el.info.email == friend) {
              friendFriend = el
            }
          })
        }
      }
      friends = []
      if (user.email == friend) {
        friends = user.friends
        if (friends.length > 0) {
          friends.forEach(el => {
            if (el.info.email == me) {
               meFriend = el
            }
          })
        }
      }
    })
    if(!meFriend || !friendFriend){
      return {
        success: false,
        message: "not found"
      };
    }else{
      return {
        success: true
      }
    }
    
  } catch (err) {
    return {
      success: false,
      message: err
    }
  }
}
var getInfoGroup = async (conversationID) => {
  try {
      console.log( 'getInfo was called')
       support = await Support.findOne({ _id: ObjectID(conversationID) })
      console.log( 'support',support)
      if(!support){
        return {
          success: false,
          message: "not found"
        };
      }else{
        return {
          success: true
        }
      }
  } catch (err) {
    console.log( `${err}`)
    return {
      success: false,
      message: err
    }
  }
}
var saveMessageInMongoose = async (message) => {
  //console.log( message,meFriend.info.email,friendFriend.info.email)
  try {
    if (meFriend) {
      meFriend.contents.push(message)
      await meFriend.save()
    } else {
      return {
        success: false,
        message: "me not found"
      };
    }

    if (friendFriend) {
      friendFriend.contents.push(message)
      await friendFriend.save()
    } else {
      return {
        success: false,
        message: "friend not found"
      };
    }
    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      message: err
    }
  }

};
var saveGroupMessageInMongoose = async (message) => {
 
  try {
    if(!support){
      return {
        success: false,
        message: "support not found"
      };
    }
    support.contents.push(message)
    await support.save()
    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      message: err
    }
  }

};
module.exports = {
  saveMessageInMongoose,getInfo,login,logout,getInfoGroup,saveGroupMessageInMongoose
};
