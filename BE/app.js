var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('./socketServer').io;
var ioRequest = require('./socketServer').request;
io.attach(http);
ioRequest();
var userCtrl = require('./controllers/userController');
var managerCtrl = require('./controllers/managerController')(io);
var driverCtrl = require('./controllers/driverController')(io);
app.io = io;
app.use(cors());
app.use(bodyParser.json());
var verifyAccessToken = (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, 'BikeApp17HCBSECERT', (err, payload) => {
            if (err) {
                res.statusCode = 403;
                res.json({
                    msg: 'INVALID TOKEN',
                    error: err
                });
            } else {
                req.token_payload = payload;
                next();
            }
        })
    } else {
        res.statusCode = 403;
        res.json({
            msg: 'NO TOKEN FOUND'
        });
    }
}

app.get('/', (req, res) => {
    res.json({
        msg: 'hello from 1742018 api'
    });
});
app.use('/user',userCtrl);
app.use('/manager',verifyAccessToken,managerCtrl);
app.use('/driver',verifyAccessToken,driverCtrl);
var port = process.env.port || 3000;
http.listen(port, () => {
    console.log(`api running on port ${port}`);
});
