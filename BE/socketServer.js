var io = require('socket.io')();
var config = require('./config/config');
var managerRepo = require('./repos/managerRepo');

io.on('connection', function(socket){
    socket.on('joinApp2',function(){
		if(socket.room){
			socket.leave(socket.room);
		}
		socket.room = config.App2.Room;
        socket.join(config.App2.Room);
        managerRepo.getRequestByStatus(config.Status.Request).then(result => {
            io.to(socket.id).emit('listRequestLocation',result);
        }).catch(err => {
            io.to(socket.id).emit('listRequestLocation',[]);
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