const User = require("../models/usermodel");
const mongoose = require("mongoose");
const redis = require("redis");
const e = require("express");
const { json } = require("body-parser");
const client = redis.createClient();

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: "Please fill all required field",
    });
  }

  // Create a new User
  const user = new User({
    name: req.body.name,
    phone: req.body.phone,
    credit: 100,
  });

  // Save user in the database
  user
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Something went wrong while creating new user.",
      });
    });
};

//get object of full id

exports.find = (req, res) => {
  //   console.log("fetching ....");
  User.findById(req.params.id)
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.id,
        });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error getting user with id " + req.params.id,
      });
    });
};

// exports.redis_user = (req, res) => {
//   client.get("userdata", (err, redis_user) => {
//     if (err) console.log(err);
//     else redis_user;
//     res.send(JSON.parse(redis_user));
//     console.log(redis_user);
//   });
// };

// exports.findcredit = (req, res) => {
//   User.findById(req.params.id)
//     .then((user) => {
//       if (!user) {
//         return res.status(404).send({
//           message: "User not found with id " + req.params.id,
//         });
//       }
//       const creditbal = user.credit;
//       res.send(user);
//       console.log(creditbal);
//     })
//     .catch((err) => {
//       if (err.kind === "ObjectId") {
//         return res.status(404).send({
//           message: "User not found with id " + req.params.id,
//         });
//       }
//       return res.status(500).send({
//         message: "Error getting user with id " + req.params.id,
//       });
//     });
// };

// add credit

exports.addcredit = (req, res) => {
  User.findById(req.params.id)
  .then((user) => {
      // console.log('user milega',user.name)
      // console.log('data api se aaya', user)
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.id,
        });
      }
      // client.set(intialcredit , 0);
      // console.log("usercredit ",client.get(intialcredit))
      // console.log(user.name)


      // Check the redis store for the data first
      client.get("credit" + user.name, async (err, rediscredit) => {
        err :false
        console.log(rediscredit)
        if (rediscredit) console.log("asyn method ka data aa raha hai ", rediscredit)
         else {
          // When the data is not found in the cache then we can make request to the server

          const rediscredit = 0;

          // save the record in the cache for subsequent request
          client.set("credit" + user.name, rediscredit);
          
          
        }
        console.log("asyn method ka data aa raha hai 22222222222", rediscredit)

        client.incrby(
          "credit" + user.name,
          req.params.credit,
          function (err, redisupdatedcredit) {
            // client.set(redis_usercredit,redisupdatedcredit)
            // console.log("updated credit", redisupdatedcredit);
            // console.log(redis_usercredit,"credit"+user.name)
            getcredit(redisupdatedcredit);
          }
        );


      });

      // client.set("credit" + user.name, user.credit);
      // console.log("username :-", user.name + " user _credit:-", rediscredit);

      // client.get("credit" + user.name, (err, redis_usercredit) => {
      //   if (err) console.log(err);
      //   else redis_usercredit;
        // console.log('data from redis wihtout decoded ', redis_us ercredit)
        // console.log('data from redis decoed',JSON.parse(redis_usercredit))
        // userobject=JSON.parse(redis_user);
        // console.log(userobject.credit)

        // client.set(user.name, user.credit, function () {
        // console.log(
        //   "old credit",
        //   JSON.parse(redis_usercredit),
        //   "new to be add credit",
        //   req.params.credit
        // );
        // client.incrby(
        //   "credit" + user.name,
        //   req.params.credit,
        //   function (err, redisupdatedcredit) {
        //     // client.set(redis_usercredit,redisupdatedcredit)
        //     // console.log("updated credit", redisupdatedcredit);
        //     // console.log(redis_usercredit,"credit"+user.name)
        //     getcredit(redisupdatedcredit);
        //   }
        // );
        // }
        // );
      // });
      //    console.log(userdata);
      //   res.send();
    })
    .catch((err) => {
      // console.log(err);
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error getting user with id " + req.params.id,
      });
    });

  function getcredit(usercredit) {
    User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { credit: usercredit },
      },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: "user not found with id " + req.params.id,
          });
        }
        console.log("updating value from here");
        console.log(user);
        res.send(user);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "user not found with id " + req.params.id,
          });
        }
        return res.status(500).send({
          message: "Error updating user with id " + req.params.id,
        });
      });
  }
};

// exports.addcredit = (req, res) => {
//   // Validate Request
//   {
//     var usercredit;
//     var userobject;

//     console.log("fetching ....");

//     User.findById(req.params.id, req.params.credit)
          // const var=__db.rejioeojoy)
//       .then((user) => {
//         //   console.log(req.params.credit)
//         console.log('data',user);
//         if (!user) {
//           return res.status(404).send({
//             message: "User not found with id " + req.params.id,
//           });
//         }
//         // res.send(user);
//          console.log(user)

//         // console.log(user.credit)
//         const a = JSON.stringify(user);
//         console.log('DB data : ', a);
//         client.setex("userdata", 60000, a);

//         // console.log('userdata')
//         client.get("userdata", (err, redis_user) => {
//           if (err) console.log(err);
//           else redis_user;
//           console.log('data from redis : ', redis_user);
//           userobject = JSON.parse(a);
//           console.log("first"+ userobject._id)
//           usercredit = userobject.credit;
//           //console.log("second "+ usercredit)
//           client.set("usercredit", usercredit, function () {
//             client.incrby(
//               "usercredit",
//               req.params.credit,
//               function (err, usercredit1) {
//                 console.log(usercredit1);
//                 userobject.credit = usercredit;
//                 getcredit(usercredit);
//               }
//             );
//           });
//         });
//       })
//       .catch((err) => {
//         if (err.kind === "ObjectId") {
//           return res.status(404).send({
//             message: "User not found with id " + req.params.id,
//           });
//         }
//         return res.status(500).send({
//           message: "Error getting user with id " + req.params.id,
//         });
//       });

//     function getcredit(creditvar) {
//       User.findByIdAndUpdate(req.params.id, {
//         $set: { credit: creditvar },
//       })
//         .then((user) => {
//           if (!user) {
//             return res.status(404).send({
//               message: "user not found with id " + req.params.id,
//             });
//           }
//           console.log("updating value from here");
//           console.log(user);
//           res.send(user);
//         })
//         .catch((err) => {
//           if (err.kind === "ObjectId") {
//             return res.status(404).send({
//               message: "user not found with id " + req.params.id,
//             });
//           }
//           return res.status(500).send({
//             message: "Error updating user with id " + req.params.id,
//           });
//         });
//     }
//   }
// };

// sub credit

// exports.subcredit = (req, res) => {
//   // Validate Request
//   {
//     var usercredit;
//     var userobject;

//     console.log("fetching ....");

//     User.findById(req.params.id, req.params.credit)
//       .then((user) => {
//         //   console.log(req.params.credit)
//         if (!user) {
//           return res.status(404).send({
//             message: "User not found with id " + req.params.id,
//           });
//         }
//         // res.send(user);
//         // console.log(user)

//         // console.log(user.credit)
//         const a = JSON.stringify(user);
//         client.setex("userdata", 60000, a);

//         // console.log('userdata')
//         client.get("userdata", (err, redis_user) => {
//           if (err) console.log(err);
//           else redis_user;
//           // console.log(redis_user);
//           userobject = JSON.parse(a);
//           // console.log("first"+ userobject.credit)
//           usercredit = userobject.credit;
//           // console.log("second "+ usercredit)
//           client.set("usercredit", usercredit, function () {
//             client.decrby(
//               "usercredit",
//               req.params.credit,
//               function (err, usercredit) {
//                 // console.log(usercredit);
//                 userobject.credit = usercredit;
//                 getcredit(usercredit);
//               }
//             );
//           });
//         });
//       })
//       .catch((err) => {
//         if (err.kind === "ObjectId") {
//           return res.status(404).send({
//             message: "User not found with id " + req.params.id,
//           });
//         }
//         return res.status(500).send({
//           message: "Error getting user with id " + req.params.id,
//         });
//       });

//     function getcredit(creditvar) {
//       User.findByIdAndUpdate(req.params.id, {
//         $set: { credit: creditvar },
//       })
//         .then((user) => {
//           if (!user) {
//             return res.status(404).send({
//               message: "user not found with id " + req.params.id,
//             });
//           }
//           console.log("updating value from here");
//           console.log(user);
//           res.send(user);
//         })
//         .catch((err) => {
//           if (err.kind === "ObjectId") {
//             return res.status(404).send({
//               message: "user not found with id " + req.params.id,
//             });
//           }
//           return res.status(500).send({
//             message: "Error updating user with id " + req.params.id,
//           });
//         });
//     }
//   }
// };

// exports.subcredit = (req, res) => {
//   User.findById(req.params.id)
//     .then((user) => {
//       // console.log('data api se aaya', user)
//       if (!user) {
//         return res.status(404).send({
//           message: "User not found with id " + req.params.id,
//         });
//       }
//       // console.log(user.name)
//       console.log("usercredit ", user.credit);
//       client.setex("credit" + user.name, 600, user.credit);
//       console.log("username :-", user.name + " user _credit:-", user.credit);
//       client.get("credit" + user.name, (err, redis_usercredit) => {
//         if (err) console.log(err);
//         else redis_usercredit;
//         // console.log('data from redis wihtout decoded ', redis_us ercredit)
//         // console.log('data from redis decoed',JSON.parse(redis_usercredit))
//         // userobject=JSON.parse(redis_user);
//         // console.log(userobject.credit)

//         // client.set(user.name, user.credit, function () {
//         console.log(
//           "old credit",
//           JSON.parse(redis_usercredit),
//           "new to be add credit",
//           req.params.credit
//         );
//         client.decrby(
//           "credit" + user.name,
//           req.params.credit,
//           function (err, redisupdatedcredit) {
//             // client.set(redis_usercredit,redisupdatedcredit)
//             // console.log("updated credit", redisupdatedcredit);
//             // console.log(redis_usercredit,"credit"+user.name)
//             getcredit(redisupdatedcredit);
//           }
//         );
//         // }
//         // );
//       });
//       //    console.log(userdata);
//       //   res.send();
//     })
//     .catch((err) => {
//       // console.log(err);
//       if (err.kind === "ObjectId") {
//         return res.status(404).send({
//           message: "User not found with id " + req.params.id,
//         });
//       }
//       return res.status(500).send({
//         message: "Error getting user with id " + req.params.id,
//       });
//     });

//   function getcredit(usercredit) {
//     User.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: { credit: usercredit },
//       },
//       { new: true }
//     )
//       .then((user) => {
//         if (!user) {
//           return res.status(404).send({
//             message: "user not found with id " + req.params.id,
//           });
//         }
//         console.log("updating value from here");
//         console.log(user);
//         res.send(user);
//       })
//       .catch((err) => {
//         if (err.kind === "ObjectId") {
//           return res.status(404).send({
//             message: "user not found with id " + req.params.id,
//           });
//         }
//         return res.status(500).send({
//           message: "Error updating user with id " + req.params.id,
//         });
//       });
//   }
// };



exports.subcredit = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      // console.log('data api se aaya', user)
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.id,
        });
      }
      // client.set(intialcredit , 0);
      // console.log("usercredit ",client.get(intialcredit))
      // console.log(user.name)


      // Check the redis store for the data first
      client.get("credit" + user.name, async (err, rediscredit) => {
        if (rediscredit) console.log("asyn method ka data aa raha hai ", rediscredit)
         else {
          // When the data is not found in the cache then we can make request to the server

          const rediscredit = 0;

          // save the record in the cache for subsequent request
          client.set("credit" + user.name, rediscredit);
          
          
        }
        console.log("asyn method ka data aa raha hai 22222222222", rediscredit)

        client.decrby(
          "credit" + user.name,
          req.params.credit,
          function (err, redisupdatedcredit) {
            // client.set(redis_usercredit,redisupdatedcredit)
            // console.log("updated credit", redisupdatedcredit);
            // console.log(redis_usercredit,"credit"+user.name)
            getcredit(redisupdatedcredit);
          }
        );


      });

      // client.set("credit" + user.name, user.credit);
      // console.log("username :-", user.name + " user _credit:-", rediscredit);

      // client.get("credit" + user.name, (err, redis_usercredit) => {
      //   if (err) console.log(err);
      //   else redis_usercredit;
        // console.log('data from redis wihtout decoded ', redis_us ercredit)
        // console.log('data from redis decoed',JSON.parse(redis_usercredit))
        // userobject=JSON.parse(redis_user);
        // console.log(userobject.credit)

        // client.set(user.name, user.credit, function () {
        // console.log(
        //   "old credit",
        //   JSON.parse(redis_usercredit),
        //   "new to be add credit",
        //   req.params.credit
        // );
        // client.incrby(
        //   "credit" + user.name,
        //   req.params.credit,
        //   function (err, redisupdatedcredit) {
        //     // client.set(redis_usercredit,redisupdatedcredit)
        //     // console.log("updated credit", redisupdatedcredit);
        //     // console.log(redis_usercredit,"credit"+user.name)
        //     getcredit(redisupdatedcredit);
        //   }
        // );
        // }
        // );
      // });
      //    console.log(userdata);
      //   res.send();
    })
    .catch((err) => {
      // console.log(err);
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error getting user with id " + req.params.id,
      });
    });

  function getcredit(usercredit) {
    User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { credit: usercredit },
      },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: "user not found with id " + req.params.id,
          });
        }
        console.log("updating value from here");
        console.log(user);
        res.send(user);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "user not found with id " + req.params.id,
          });
        }
        return res.status(500).send({
          message: "Error updating user with id " + req.params.id,
        });
      });
  }
};


exports.getjson =(req,res) =>{
client.get(json, async(err,js)=>{
  if(js){
    res.send(JSON.parse(js))
  }
  else{
    client.set(json, 'https://jsonplaceholder.typicode.com/photos')
    return res.status(200).send({
      error: false
    });
  }
})
}