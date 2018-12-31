var io = require('socket.io')();
var config = require('./config/config');
var managerRepo = require('./repos/managerRepo');
var driverRepo = require('./repos/driverRepo');
var schedule = require('node-schedule');
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

    socket.on('joinApp4',function(id){
		if(socket.room){
			socket.leave(config.App4.Room);
        }
        socket.room = config.App4.Room;
        socket.idDriver = id;
        socket.join(config.App4.Room);
        var job = schedule.scheduleJob('*/10 * * * * *', function () {
            var model1 = {
                idDriver: 0,
                min: 0,
            };
            driverRepo.getRequest(2).then(dataApp4 => {
                driverRepo.getDriver().then(result=>{
                    var pos1 = JSON.parse(dataApp4[0].Location1)
                    result.forEach(element => {
                        var pos2 = JSON.parse(element.Location)
                        if (model1.min == 0 || model1.min > haversine(pos1,pos2))
                            {
                                model1.idDriver = element.IDUser;
                                model1.min = haversine(pos1,pos2)
                            }        
                    }) 
                    if (socket.idDriver == model1.idDriver) {
                        io.to(socket.id).emit('listApp4',dataApp4);
                    }
                })
                }).catch(errApp4 => {
                    io.to(socket.id).emit('listApp4',[]);
                });
        })
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

var rad = function(x) {
    return x * Math.PI / 180;
};
function haversine(pos1,pos2){
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(pos1.lat - pos2.lat);
    var dLong = rad(pos1.lng - pos2.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(pos2.lat)) * Math.cos(rad(pos1.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d
};
module.exports = io;