var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var userCtrl = require('./controllers/userController');
var managerCtrl = require('./controllers/managerController');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(cors());
app.use(bodyParser.json());

io.on('connection', function(socket){
	socket.on('join',function(room){
		if(socket.room){
			socket.leave(socket.room);
		}
		socket.room = room;
		socket.join(room);
		io.in(room).clients((err, clients) => {
		  io.sockets.in(room).emit('listUser',clients);
		});
	});
    socket.on('disconnect', function(){
        io.in(socket.room).clients((err, clients) => {
		  io.sockets.in(socket.room).emit('listUser',clients);
		});
    });
    socket.on('clientsendMess',function(socketid,msg){
		io.to(socketid).emit('clientreciverMess',msg);
    });
});

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
var port = process.env.port || 3000;
http.listen(port, () => {
    console.log(`api running on port ${port}`);
});
