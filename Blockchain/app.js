const express = require('express');
const app = express();
const PORT = 5000 || process.env.PORT;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const web3 = require('web3');
const cookieParser = require('cookie-parser');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const DB = require('./config/key').MongoURI;
mongoose.connect(DB,{useNewUrlParser: true})
.then(() => console.log('MongoDB connected...'))
.catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.set('view engine','ejs');
app.set('web3', web3);
app.use(express.static(__dirname+ '/public'));

app.use('/',require('./routes/home'));



app.listen(PORT,(req,res) => {
  console.log(`connect`);
});





