var io = require('socket.io')();
var config = require('./config/config');
var managerRepo = require('./repos/managerRepo');

io.on('connection', function(socket){
    socket.on('joinApp1',function(){
		if(socket.room){
			socket.leave(socket.room);
		}
    });
    socket.on('joinApp2',function(){
		if(socket.room){
			socket.leave(config.App2.Room);
		}
		socket.room = config.App2.Room;
        socket.join(config.App2.Room);
        managerRepo.getRequestByStatus(config.Status.Request).then(result => {
            io.to(socket.id).emit('listRequestLocation',result);
        }).catch(err => {
            io.to(socket.id).emit('listRequestLocation',[]);
        });
    });
    
    socket.on('joinApp3',function(){
		if(socket.room){
			socket.leave(config.App3.Room);
		}
		socket.room = config.App3.Room;
        socket.join(config.App3.Room);
        managerRepo.getRequestManagement().then(result => {
            io.to(socket.id).emit('listApp3',result);
        }).catch(err => {
            io.to(socket.id).emit('listApp3',[]);
        });
    });

    socket.on('disconnect', function(){
        io.in(socket.room).clients((err, clients) => {
		  io.sockets.in(socket.room).emit('listUser',clients);
        });
        if(socket.room){
			socket.leave(socket.room);
		}
    });
});

module.exports = io;