var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();
var flash = require('connect-flash');
var session = require('express-session')
var passport = require('./config/passport');

//DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const db = require('./config/keys').MongoURI;
mongoose.connect(db,{useNewUrlParser:true})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

//Express Session



//Other setting
app.set('view engine', 'ejs');
app.use(express.static(__dirname+ '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({secret: 'Mysecret',resave: true,saveUninitialized: true}));

//Passport
app.use(passport.initialize());  //Passport를 초기화
app.use(passport.session());    //passport와 session을 연결시켜줌

app.use(function(req,res,next) {
  res.locals.isAuthenticated = req.isAuthenticated(); //passport제공 함수 로그인이 되어있는지 아닌지 true , false
  res.locals.currentUser = req.user; //req.user는 passport에서 추가하는 항목으로 로그인이 되면 session으로 부터 user를 deserialize하여 생성
  next();   //req.locals담겨진 변수는 ejs사용 가능하다.
})
//Routes
app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));
app.use('/posts' , require('./routes/posts'));

const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server connected on port ${PORT}`));