var async = require('asyncawait/async');
var await = require('asyncawait/await');
const router = require("express").Router();
const { ObjectID } = require("mongodb");
const getUser = require("../middlewares/get-user");
const User = require("../models/user");
const Friend = require("../models/friends");
const Support = require("../models/support");
const Chat = require("../models/chat");
const mongoose = require("mongoose");

router.post("/signup", getUser, (req, res, next) => {
  let user = new User();
  user.displayName = req.user.displayName || "Khách";
  user.email = req.user.email;
  user.photoURL = req.user.photoURL || "https://i.imgur.com/6RUJRyM.png";
  user.phoneNumber = req.user.phoneNumber;

  User.findOne({ email: req.user.email }, (err, existUser) => {
    if (err) return next(err);

    if (existUser) {
      res.json({
        success: false,
        message: "Account with that email is already exist"
      });
    } else {
      user.save();

      res.json({
        success: true,
        user
      });
    }
  });
});

router.post("/login", getUser, (req, res, next) => {
  User.findOne({ email: req.user.email }, (err, user) => {
    if (err) return next(err);

    if (!user) {
      if (req.body.type === "social") {
        let user = new User();
        user.displayName = req.user.displayName || "Khách";
        user.email = req.user.email;
        user.photoURL = req.user.photoURL || "https://i.imgur.com/6RUJRyM.png";
        user.phoneNumber = req.user.phoneNumber;
        user.save();

        res.json({
          success: true,
          user
        });
      } else {
        res.json({
          success: false,
          message: "User not found!"
        });
      }
    } else {
      res.json({
        success: true,
        user
      });
    }
  }).populate('likes')
  .populate('friends')
  .populate({
    path: 'support',
    populate: [{
      path: 'users'
    },
     {
      path: 'support'
    }]
  });
});
router
  .route("/info")
  .get(getUser, (req, res, next) => {
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) return next(err);
      if (user) {
        res.json({
          success: true,
          user,
          message: "Successful Manipulation!"
        });
      } else {
        res.json({
          success: false,
          message: "Users is not exist!"
        });
      }
    }).populate('likes')
      .populate('friends')
      .populate({
        path: 'support',
        populate: [{
          path: 'users'
        },
         {
          path: 'support'
        }]
      });
  })

//Hiển Thị Profile để test
router
  .route("/profile")
  .get(getUser, (req, res, next) => {
    User.find({}, (err, users) => {
      if (err) return next(err);
      if (users) {
        res.json({
          success: true,
          users,
          message: "Successful Manipulation!"
        });
      } else {
        res.json({
          success: false,
          message: "Users is not exist!"
        });
      }
    });
  })


router
  .route("/profile/id")
  .post(getUser, (req, res, next) => {
    User.findOne({ _id: ObjectID(req.body._id) }, (err, user) => {
      if (err) return next(err);
      if (user) {
        res.json({
          success: true,
          user,
          message: "Successful Manipulation!"
        });
      } else {
        res.json({
          success: false,
          message: "Users is not exist!"
        });
      }
    }).populate('likes');
  })


router.route("/like")
  .get(getUser, (req, res, next) => {
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) return next(err);
      if (user) {
        res.json({
          success: true,
          user
        })
      } else {
        res.json({
          success: false,
          message: "User not found"
        })
      }
    }).populate('likes');

  })
  .post(getUser, (req, res, next) => {
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) return next(err);

      if (user) {
        if (req.body._id) {
          let check = false;
          user.likes.forEach(el => {
            if (el._id == req.body._id) {
              check = true
            }
          })

          if (!check) {
            user.likes.push(ObjectID(req.body._id))
            user.save();
            res.json({
              success: true,
              user
            });
          } else {
            res.json({
              success: false,
              message: "User was liked"
            })
          }

        } else {
          res.json({
            success: false,
            message: "No _id"
          })
        }
      } else {
        res.json({
          success: false,
          message: "User not found"
        })
      }
    }).populate('likes');

  })
  .delete(getUser, (req, res, next) => {
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) return next(err);

      if (user) {
        let index = user.likes.map(el => String(el._id)).indexOf(String(req.headers["_id"]))
        if (index > -1) {
          user.likes.splice(index, 1)
          res.json({
            success: true,
            user
          });
          user.save();
        } else {
          res.json({
            success: false,
            message: "_id is undefined"
          });
        }

      } else {
        res.json({
          success: false,
          message: "User not found"
        })
      }
    }).populate("likes");

  });
//API update thông tin người dùng
router.route("/update")
  .post(getUser, (req, res, next) => {
    User.findOne({ email: req.user.email }, (err, users) => {
      if (err) return next(err);
      if (users) {
        if (req.body.displayName) {
          users.displayName = req.body.displayName;
        }
        if (req.body.photoURL) {
          users.photoURL = req.body.photoURL;
        }
        if (req.body.phoneNumber) {
          users.phoneNumber = req.body.phoneNumber;
        }
        if (req.body.address) {
          users.address = req.body.address;
        }
        if (req.body.image) {
          users.image = req.body.image;
        }
        if (req.body.listImage) { 
          users.listImage = req.body.listImage;
        }
        if (req.body.active) {
          users.active = req.body.active;
        }
        if (req.body.sex) {
          users.sex = req.body.sex;
        }
        if (req.body.date) {
          users.date = req.body.date;
        }
        if (req.body.callId) {
          users.callId = req.body.callId;
        }
        if (req.body.suitable) {
          users.suitable = req.body.suitable;
        }
        if (req.body.age) {
          users.age = req.body.age;
        }
        console.log('body',req.body)
        if (req.body.isOnline == false || req.body.isOnline == true) {
          users.isOnline = req.body.isOnline;
        }
        if (req.body.lastOnline) {
          users.lastOnline = req.body.lastOnline;
        }
        if (req.body.relationShip) {
          users.relationShip = req.body.relationShip;
        }
        if (req.body.job) {
          users.job = req.body.job;
        }
        if (req.body.relate_status) {
          users.relate_status = req.body.relate_status;
        }
        if (req.body.suitable) {
          users.suitable = req.body.suitable;
        }
        if (req.body.height) {
          users.height = req.body.height;
        }
        if (req.body.weight) {
          users.weight = req.body.weight;
        }
        if (req.body.knowledge) {
          users.knowledge = req.body.knowledge;
        }
        if (req.body.smoke) {
          users.smoke = req.body.smoke;
        }
        if (req.body.religion) {
          users.religion = req.body.religion;
        }
        users.save();

        res.json({
          success: true,
          users,
          body: req.body
        });
      } else {
        res.json({
          success: false,
          message: "User not found!"
        });
      }
    });
  });

router.route("/friend/add")
  .post(getUser, (req, res, next) => {
    try {
      User.findOne({ email: req.user.email }, (err, user) => {
        if (err) return next(err);
        if (user) {
          if (req.body._id) {
            let check = false;
            user.friends.forEach(el => {
              if (el.info._id == req.body._id) {
                check = true
              }
            })
            console.log("check", check)
            if (!check) {
              let friend = new Friend({
                _id: new mongoose.Types.ObjectId(),
                info: ObjectID(req.body._id),
                isAccept: false,
                isPendingRequest: true,
                requestMessage: req.body.message,
                isSender: true,
                contents: [{
                  message: req.body.hiMessage,
                  from: user.email,
                  createAt: new Date(),
                }]
              })
              friend.save(err => {
                if (err) {
                  console.log(err)
                  res.json({
                    success: false,
                    message: err
                  });
                }
                user.friends.push(ObjectID(friend._id))
                user.save(err => {
                  if (err) {
                    console.log(err)
                    res.json({
                      success: false,
                      message: err
                    });
                  }
                  User.findOne({ _id: ObjectID(req.body._id) }, (err, friendUser) => {
                    if (err) return next(err);
                    if (friendUser) {
                      let friend2 = new Friend({
                        _id: new mongoose.Types.ObjectId(),
                        info: ObjectID(user._id),
                        isAccept: false,
                        isPendingRequest: true,
                        requestMessage: req.body.hiMessage,
                        isReceiver: true,
                        contents: [{
                          message: req.body.hiMessage,
                          from: user.email,
                          createAt: new Date(),
                        }]
                      })
                      friend2.save(err => {
                        if (err) {
                          console.log(err)
                          res.json({
                            success: false,
                            message: err
                          });
                        }
                        friendUser.friends.push(ObjectID(friend2._id))
                        friendUser.save()
                        res.json({
                          success: true,
                          user
                        });
                      })
                    } else {
                      res.json({
                        success: false,
                        message: "User not found"
                      })
                    }


                  })

                })
              })
            } else {
              res.json({
                success: false,
                message: "User was friends"
              })
            }

          } else {
            res.json({
              success: false,
              message: "No _id"
            })
          }
        } else {
          res.json({
            success: false,
            message: "User not found"
          })
        }
      }).populate('friends');
    } catch (err) {

    }

  })
router
  .route("/friend/list")
  .get(getUser, (req, res, next) => {
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) return next(err);
      if (user) {
        res.json({
          success: true,
          user: user.friends
        });
      } else {
        res.json({
          success: false,
          message: "User is not exist!"
        });
      }
    }).populate({
      path: 'friends',
      populate: {
        path: 'info'
      }
    });
  })
router.route("/friend/accept")
  .post(getUser, (req, res, next) => {
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) return next(err);
      if (user) {
        if (req.body._id) {
          let check = false;
          user.friends.forEach(el => {
            if (el.info._id == req.body._id) {
              check = true
            }
          })
          if (check) {
            Friend.findOne({ info: ObjectID(req.body._id) }, (err, friendsend) => {
              if (err) return next(err);
              if (friendsend) {
                friendsend.isAccept = true,
                  friendsend.save(err => {
                    if (err) {
                      console.log(err)
                      res.json({
                        success: false,
                        message: err
                      });
                    }
                    Friend.findOne({ info: ObjectID(user._id) }, (err, friendReceive) => {
                      if (err) return next(err);
                      if (friendReceive) {
                        friendReceive.isAccept = true,
                          friendReceive.save()
                        res.json({
                          success: true,
                          user: friendReceive
                        })
                      }
                    })
                  })
              }
              else {
                res.json({
                  success: false,
                  message: "friends not found"
                })
              }


            })
          }
          else {
            res.json({
              success: false,
              message: "Not friend"
            })
          }


        }
        else {
          res.json({
            success: false,
            message: "No _id"
          })
        }
      }
      else {
        res.json({
          success: false,
          message: "User not found"
        })
      }
    }).populate('friends');
  })

router.route("/friend/delete")
  .post(getUser, async (req, res, next) => {
    try {
      let user = await User.findOne({ email: req.user.email }).populate('friends')
      if (user) {
        if (req.body._id) {
          let index = -1;
          let friend
          user.friends.forEach((el, i) => {
            if (String(el.info._id) == String(req.body._id)) {
              index = i
              friend = el._id
            }
          });
          if(friend){
            Friend.findByIdAndDelete(friend)
          }
         
          if (index > -1) {
            user.friends.splice(index, 1)
            await user.save()
            let otherUser = await User.findOne({ _id: ObjectID(req.body._id) }).populate('friends')
            if (otherUser) {
              let index = -1;
              let friend
              otherUser.friends.forEach((el, i) => {
                if (String(el.info._id) == String(user._id)) {
                  index = i
                  friend = el._id
                }
              });
              if(friend){
                 Friend.findByIdAndDelete(friend)
               }
              if (index > -1) {
                otherUser.friends.splice(index, 1)
                await otherUser.save()
                res.json({
                  success: true
                });
              } else {
                res.json({
                  success: false,
                  message: "user in other friend list not found!"
                });
              }
            } else {
              res.json({
                success: false,
                message: "other user not found!"
              });
            }
          } else {
            res.json({
              success: false,
              message: "Friend not found!"
            });
          }
        } else {
          res.json({
            success: false,
            message: "Friend not found!"
          });
        }
      } else {
        res.json({
          success: false,
          message: "User not found!"
        });
      }
    } catch (err) {
      res.json({
        success: false,
        message: err
      });
    }

  });
  router.route("/support/add")
  .post(getUser,async (req, res, next) => {
    try{
      let user = await User.findOne({ email: req.user.email })
      let friend = await User.findOne({ email: req.body.friend })
      let support = await User.findOne({ email: req.body.support })
      if(user && friend && support){
        let supportS = new Support({
          _id: new mongoose.Types.ObjectId(),
          support: ObjectID(support._id),
          users:[ObjectID(user._id),ObjectID(friend._id)],
          contents:[
            {
              message: "Xin chào",
              from: user.email,
              createAt: new Date()
            },
            {
              message: "Xin chào",
              from: friend.email,
              createAt: new Date()
            },
            {
              message: "Xin chào, mình là người hỗ trợ",
              from: support.email,
              createAt: new Date()
            }
          ]
        }) 
        await supportS.save(err => {
          if (err) {
            console.log(err)
            res.json({
              success: false,
              message: err
            });
          }
        })
        user.support.push(ObjectID(supportS._id))
        friend.support.push(ObjectID(supportS._id))
        support.support.push(ObjectID(supportS._id))
        await user.save()
        await friend.save()
        await support.save()
        res.json({
          success: true,
          data:{
            user,
            friend,
            support
          }
        });
      }else{
        res.json({
          success: false,
          message: "Not found"
        });
      }
    }   catch (err) {
      res.json({
        success: false,
        message: `${err}. From try catch`
      });
    }
  });
module.exports = router;
