require('dotenv').config();

var express = require('express');
var exphbs = require('express-handlebars');
var mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398"
});

var port = process.env.PORT || 3000

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', async function (req, res) {
    console.log(req.headers.host);
    var preferenceRequest = {
        items: [
            {
                id: 1234,
                title: req.query.title,
                description: "Dispositivo móvil de Tienda e-commerce",
                quantity: 1,
                picture_url: "",
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
        external_reference: "mimail@gmail.com",
        back_urls: {
            success: `${process.env.BASE_URL}/payment-success`,
            pending: `${process.env.BASE_URL}/payment-pending`,
            failure: `${process.env.BASE_URL}/payment-failed`,
        }
    }

    var preference = await mercadopago.preferences.create(preferenceRequest);
    console.log(preference);
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
    res.render('payment',req.query);
})

app.get('/payment-pending', (req, res) => {
    res.render('payment',req.query);
})

app.get('/payment-success', (req, res) => {
    res.render('payment',req.query);
})


app.listen(port);