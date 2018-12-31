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
        var check = 0;
        listDriverClient.forEach(function(element){
            if(element.idDriver == socket.idDriver)
            {
                check = 1;
                element.idRoom = socket.id
            }
        })
        if (check == 0){
            listDriverClient.push({idDriver: socket.idDriver,idRoom:socket.id})
        }
    });
    socket.on('disconnect', function(){
        listDriverClient.forEach(function(element){
            if(element.idDriver == socket.idDriver){
                listDriverClient.pop(element);
            }
        })
        io.in(socket.room).clients((err, clients) => {
		  io.sockets.in(socket.room).emit('listUser',clients);
        });
        if(socket.room){
			socket.leave(socket.room);
		}
    });
});
var countRequest = 0;
var listDriverClient = [];
var listDriver = [];
function request(){
    var job = schedule.scheduleJob('*/5 * * * * *', function () {
        var model1 = {
            idDriver: 0,
            min: 0,
        };
        driverRepo.getRequest(2).then(dataApp4 => {
            if(dataApp4.length > 0)
            {
                if(countRequest == config.MaxRequest){
                    listDriver = [];
                    var model = {
                        Id: dataApp4[0].Id,
                        Status: 5
                    };  
                    driverRepo.updateStatusRequest(model).then(result =>{
                        managerRepo.getRequestManagement().then(dataApp3 => {
                            io.sockets.in(config.App3.Room).emit('listApp3',dataApp3);
                            }).catch(errApp3 => {
                                io.sockets.in(config.App3.Room).emit('listApp3',[]);
                            });
                        })
                }
                driverRepo.getDriver().then(result=>{
                    if(result.length > 0)
                    {   
                        result.forEach(element => { 
                            var checkDriver = 0;
                            listDriver.forEach(element2 => {
                                if(element.IDUser == element2.idDriver){
                                    checkDriver = 1;
                                    return;
                                }
                            });                  
                            if ( checkDriver == 0){
                                var pos1 = JSON.parse(dataApp4[0].Location1)
                                var pos2 = JSON.parse(element.Location)
                                if (model1.min == 0 || model1.min > haversine(pos1,pos2))
                                {
                                    model1.idDriver = element.IDUser;
                                    model1.min = haversine(pos1,pos2)
                                }        
                            }
                        }) 
                    if(model1.min != 0){
                        listDriverClient.forEach(element =>{
                            if(element.idDriver == model1.idDriver)
                            {                            
                                listDriver.push({idDriver: model1.idDriver})
                                io.to(element.idRoom).emit('listApp4',dataApp4);
                                return;
                            }
                        })
                        }
                }
                    
                })       
            countRequest = countRequest + 1;
            }
            }).catch(errApp4 => {
                listDriverClient.forEach(function(element){
                    if(element.idDriver == model1.idDriver)
                    {  
                        io.to(element.idRoom).emit('listApp4',[]);
                    }
                })
            }); 
    })
}
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
module.exports.io = io;
module.exports.request = request;