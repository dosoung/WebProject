const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/User');

//Serialize & deserailize User 
passport.serializeUser(function(user,done) {
  done(null, user.id);              //serialize는 어떤 정보를 session에 저장할지 구하는 것이다.
})

passport.deserializeUser(function(id,done) {
  User.findOne({_id:id}, function(err,user) {
    done(err, user);
  });
});

//local Strategy
passport.use('local-login',
  new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback: true
  },
  function(req, username, password, done) {
    User.findOne({username:username})
      .select({password:1})
      .exec(function(err,user) {
        if(err) return done(err);

        if(user && user.authenticate(password)) {
          return done(null, user);
        }
        else {
          req.flash('username', username);
          req.flash('errors', {login: '이름 또는 비밀번호가 다릅니다.'});
          return done(null, false); //done함수의 첫번째 인자는 항상 error를 담기 위한 것이므로 error가 없으면 null담는다
        }
      });
  }
  ));

  module.exports = passport;