var mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:[true,'사용자 아이디가 필요합니다.'],
    match:[/^.{4,12}$/,'아이디는 4글자 이상 12글자 이하여야 합니다.'],
    trim:true,
    unique:true
  },
  name:{
    type:String,
    required:[true,'이름이 필요합니다.']
  },
  phone:{
    type:String,
    required:[true,'휴대전화 번호가 필요합니다'],
    match:[/^[0-9]{7,}$/,'유효한 형식이 아닙니다.'],
    trim:true
  },
  email:{
    type:String,
    required:[true,'이메일 주소가 필요합니다.'],
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'유효한 형식이 아닙니다.'],
    trim:true
  },
  password:{
    type:String,
    required:[true,'비밀번호가 필요합니다.'],
    select:false
  }
},{
  toObject: {virtuals:true}
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
var passwordRegex =  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = '비밀번호는 최소 8자리 이상이고 숫자와 알파벳 조합으로 만들어야 합니다.';
userSchema.path('password').validate(function(v) {
  var user = this; // 3-1

  // create user // 3-3
  if(user.isNew){ // 3-2
    if(!user.passwordConfirmation){
      user.invalidate('passwordConfirmation', 'Password Confirmation is required.');
    }
    if(!passwordRegex.test(user.password)) {
      user.invalidate('password',passwordRegexErrorMessage);
    }

    if(user.password !== user.passwordConfirmation) {
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
    if(user.newPassword && passwordRegex.test(user.newpasswrod)) {
      user.invalidate('newPassword',passwordRegexErrorMessage);
    }

    if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
});

userSchema.pre('save' , function(next) {
  var user = this;
  if(!user.isModified('password')) {
    return next();
  }
  else {
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
});

userSchema.methods.authenticate = function (password)  {
  var user = this;
  return bcrypt.compareSync(password,user.password);
};


// model & export
var User = mongoose.model('member',userSchema); //'member'가 collection이름 몽고는 알아서 s를 붙인다 schema에
module.exports = User;