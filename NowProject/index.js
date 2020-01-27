var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();
var flash = require('connect-flash');
var session = require('express-session')

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
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));


//Other setting
app.set('view engine', 'ejs');
app.use(express.static(__dirname+ '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')

    next();
});
//Routes
app.use('/', require('./routes/home'));
app.use('/posts' , require('./routes/posts'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server connected on port ${PORT}`));