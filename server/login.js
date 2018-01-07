global.__basedir = __dirname;

var ddb = require(__basedir + '/../app.js');

var USERS = {
  "bob":"asd",
  "sam":"ddd",
  "kim":"kkk",
};

function isValidPassword(data,cb){
  ddb.db.user.find({username:data.username,password:data.password},function(err,res){
      if(res.length > 0)
          cb(true);
      else
          cb(false);
  });
}

function isUsernameTaken(data,cb){
ddb.db.user.find({username:data.username},function(err,res){
      if(res.length > 0)
          cb(true);
      else
          cb(false);
  });
}

function addUser(data,cb){
  ddb.db.user.insert({username:data.username,password:data.password},function(err){
      cb();
  });
}

module.exports.USERS = USERS;
module.exports.isValidPassword = isValidPassword;
module.exports.isUsernameTaken = isUsernameTaken;
module.exports.addUser = addUser ;
