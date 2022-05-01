require('dotenv').config();

var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398",
    integrator_id: "dev_24c65fb163bf11ea96500242ac130004"
});

var port = process.env.PORT || 3000

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
app.use(bodyParser.json())


app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', async function (req, res) {
    console.log(req.headers.host);
    var preferenceRequest = {
        auto_return: "approved",
        items: [
            {
                id: 1234,
                title: req.query.title,
                description: "Dispositivo móvil de Tienda e-commerce",
                quantity: 1,
                picture_url: `${process.env.BASE_URL}/assets/${req.query.img}`,
                unit_price: +req.query.price,
            }
        ],
        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_63274575@testuser.com",
            phone: {
                area_code: "11",
                number: 1558543272
            },
            address: {
                street_name: "Falsa",
                street_number: 123,
                zip_code: "1826"
            }
        },
        payment_methods:{
            installments: 6,
            excluded_payment_methods:[
                {
                    id:"visa"
                }
            ]
        },
        external_reference: "mimail@gmail.com",
        back_urls: {
            success: `${process.env.BASE_URL}/payment-success`,
            pending: `${process.env.BASE_URL}/payment-pending`,
            failure: `${process.env.BASE_URL}/payment-failed`,
        },
        notification_url: `${process.env.BASE_URL}/notifications?source_news=webhooks`,
    }
    var preference = await mercadopago.preferences.create(preferenceRequest);
    var response = {
        title: req.query.title,
        quantity: +req.query.unit,
        unit_price: +req.query.price,
        preference_id: preference.body.id,
        img: req.query.img,
        init_point:  preference.body.init_point
    };
    res.render('detail', response);
});

app.get('/payment-failed', (req, res) => {
    req.query.img_name ="kuba-icon-delete.png";
    req.query.state = "Pago fallido";
    res.render('payment',req.query);
})

app.get('/payment-pending', (req, res) => {
    req.query.img_name ="kuba-icon-question.png";
    req.query.state = "Pago pendiente";
    res.render('payment',req.query);
})

app.get('/payment-success', (req, res) => {
    req.query.img_name ="kuba-icon-ok.png";
    req.query.state = "Pago aprobado";
    res.render('payment',req.query);
})

app.post('/notifications', (req, res)=>{
    let notification = req.body;
    console.log(req.query);
    console.log(notification);
    return res.sendStatus(200);
});


app.listen(port);