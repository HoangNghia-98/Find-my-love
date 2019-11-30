const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { port, database } = require("./config");
const app = express();
var admin = require('firebase-admin');
var serviceAccount = require("./key/find-my-love-firebase-adminsdk-rr4p1-3b3f679b77");
let http = require('http').Server(app);
let io = require('socket.io')(http);
var async = require('asyncawait/async');
var await = require('asyncawait/await');

const { isRealString } = require("./chat/utils/validation");
const { generateMessage } = require("./chat/utils/message")
const {saveMessageInMongoose,getInfo,login,logout,getInfoGroup,saveGroupMessageInMongoose} = require("./chat/utils/users")
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://find-my-love.firebaseio.com"
    })

}
catch (err) {
    console.log(err)
}

mongoose.connect(
    database,
    { useNewUrlParser: true },
    err => {
        if (err) {
            console.log(err);
        } else {
            console.log("Connected to the database");
        }
    }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

const userRoutes = require("./routes/account");
app.use("/api/accounts", userRoutes);

var room = 0
var roomGroup = 0
var conversationID = ""
io.on('connection', (socket) => {
  console.log( 'connection')
    let me =""
    let friend = ""
    let meGroup =""
    let friendGroup = ""
    let supportGroup
    var isLoging = false
    socket.on('login',(data)=>{
      console.log('login 123', data)
      isLoging = true
    
      try{
        login(data.email)
      }catch(err){
        console.log( err)
      }
     
    })
    socket.on('logout',(data)=>{
      console.log("logout",data)
      if(data.email){
        try{
          logout()
        }catch(err){
          console.log( err)
        }
      
      }
    })
    socket.on('disconnect',  () => {
      console.log( 'isLoging',isLoging)
      if(isLoging){
        try{
          logout()
        }catch(err){
          console.log( err)
        }
      
      }
      console.log("disconnect")
    });
    socket.on('join', (data) => {
        me = data.me
        friend = data.friend
        let sum1 = 0
        for (let i = 0; i < me.length; i++) {
            sum1 += me.charCodeAt(i) * 123456789
        }
        let sum2 = 0
        for (let i = 0; i < friend.length; i++) {
            sum2 += friend.charCodeAt(i) * 123456789
        }
        room = sum1+sum2
        socket.join(room);
        io.to(room).to(room).emit('users-changed',{user:room, event: 'joined'})
        getInfo(me,friend).then(check=>{
            if(!check['success']){
                io.to(room).emit('error',{
                    message:'something wrong'
                })
            }
        });
    });
    socket.on('join-group', (data) => {
      conversationID = data.conversationID
   
      roomGroup = conversationID
      socket.join(roomGroup);
      io.to(roomGroup).to(roomGroup).emit('users-changed-group',{user:roomGroup, event: 'joined'})
      getInfoGroup(conversationID).then(check=>{
          if(!check['success']){
              io.to(roomGroup).emit('error',{
                  message:'something wrong'
              })
          }
      });
  });

    socket.on('add-message',(message) => {
      try{
        let data = { message: message.message, from: me, createAt: new Date() }
        console.log("data:", data)
        io.to(room).emit('message', data);
        saveMessageInMongoose(data).then(check=>{
          console.log( 'save',me)
            if(!check['success']){
                io.to(room).emit('error',{
                    message:'something wrong'
                })
            }
        });
      }catch(err){
        console.log( err)
        io.to(room).emit('error',{
          message:'something wrong'
        })
      }  
    });
    socket.on('add-message-group',(message) => {
      try{
        let data = { message: message.message, from: message.from, createAt: new Date() }
        console.log("data:", data)
        io.to(roomGroup).emit('message-group', data);
        saveGroupMessageInMongoose(data).then(check=>{
          console.log( 'save',me)
            if(!check['success']){
                io.to(roomGroup).emit('error',{
                    message:'something wrong'
                })
            }
        });
      }catch(err){
        console.log( err)
        io.to(roomGroup).emit('error',{
          message:'something wrong'
        })
      }  
    });
});

http.listen(port, err => {
    console.log("Start on port", port);
});
