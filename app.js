require('dotenv').config();

var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
app.use(bodyParser.json())

app.use('/assets', express.static(__dirname + '/assets'));

//Route modules
var mp = require('./routes/mercadopago');

app.use('/', mp);

app.listen(port);