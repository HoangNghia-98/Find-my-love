var admin = require('firebase-admin');
//! Important! lúc deploy thì dùng đoạn comment phía dưới
// Cái dưới lấy token rồi phân giải ra uid của user 
// mà cái token này hay thay đổi mà uid cố định nên khi dev lấy uid cho khỏe

module.exports = (req, res, next) => {
  try{
    let token = req.headers["authorization"];
    if (token) {
        admin.auth().verifyIdToken(token)
            .then(decodedToken => {
                var uid = decodedToken.uid;
                admin.auth().getUser(uid).then(user => {
                   req.user = user
                //    console.log("----------------------req from middleware",req.user)
                    next();
                })
            }).catch(err => {
                res.status(403).json({
                    success: false,
                    message:err
                });
            })
    } else {
        res.status(403).json({
            success: false,
            message: "No token provided"
        });
    }
  }catch(err){
    console.log( err)
  }
    
};

// module.exports = (req, res, next) => {

//             var uid = "T0EgBEN6QMO1ObjFpsOyGXMMEQo2";
//             admin.auth().getUser(uid).then(user => {
//                 req.user = user
//                 console.log("----------------------req from middleware", req.user.email)
//                 next();
//             })
// };
