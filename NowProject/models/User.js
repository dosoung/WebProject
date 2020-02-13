var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    name: {
        type:String, 
        required:[true , '이름이 필요합니다.'],
        match:[/^.{3,5}$/,'이름은 3글자에서 5글자 사이어야 합니다.'],
        trim:true
    },
    phone: {
        type: String, 
        required:true,
        match:[/^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/,'유효한 휴대전화 형식이 아닙니다.'],
        trim: true
    },
    id: {
        type: String, 
        required:[true,'ID가 필요합니다.'],
        match:[/^.{4,12}$/,'아이디는 4글자이상 12글자 이하이어야 합니다.'],
        trim:true
    },
    password: {
        type:String, 
        required:[true,'비밀번호가 필요합니다.'],
        select:false
    },
    date: {type:Date , default:Date.now()}
},{
    toObject:{virtuals:true}
});

userSchema.virtual('passwordConfirmation')
  .get(function(){ return this._passwordConfirmation; })
  .set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual('originalPassword')
  .get(function(){ return this._originalPassword; })
  .set(function(value){ this._originalPassword=value; });

userSchema.virtual('currentPassword')
  .get(function(){ return this._currentPassword; })
  .set(function(value){ this._currentPassword=value; });

userSchema.virtual('newPassword')
  .get(function(){ return this._newPassword; })
  .set(function(value){ this._newPassword=value; });

// password validation // 3
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = '비밀번호는 최소 8자 이상이고 숫자와 알파벳 조합으로 만들어야 합니다.';

userSchema.path('password').validate(function(v) {
  var user = this; // 3-1

  // create user // 3-3
  if(user.isNew){ // 3-2
    if(!user.passwordConfirmation){
      user.invalidate('passwordConfirmation', 'Password Confirmation is required.');
    }

    if(!passwordRegex.test(user.password)) {
      user.invalidate('password', passwordRegexErrorMessage);
    }
    else if(user.password !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }

  // update user // 3-4
  if(!user.isNew){
    if(!user.currentPassword){
      user.invalidate('currentPassword', 'Current Password is required!');
    }
    else if(!bcrypt.compareSync(user.currentPassword, user.originalPassword)){
      user.invalidate('currentPassword', 'Current Password is invalid!');
    }

    if(user.newPassword && !passwordRegex.test(user.newPassword)){ // 2-3
      user.invalidate("newPassword", passwordRegexErrorMessage); // 2-4
    }
    else if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
});

userSchema.pre('save', function (next){
    var user = this;
    if(!user.isModified('password')){ // 3-1
      return next();
    }
    else {
      user.password = bcrypt.hashSync(user.password); //3-2
      return next();
    }
  });
  
userSchema.methods.authenticate = function (password) {
    var user = this;
    return bcrypt.compareSync(password,user.password);
};
  

// model & export
var User = mongoose.model('user',userSchema);
module.exports = User;
