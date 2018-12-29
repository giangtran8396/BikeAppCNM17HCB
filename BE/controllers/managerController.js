var ioSocket;
var config = require('../config/config')
var express = require('express');
var managerRepo = require('../repos/managerRepo');
var router = express.Router();

router.post('/receiverRequest',(req,res) => {
    var model = req.body || {};
    managerRepo.receiverRequest(model).then(result => {
        res.statusCode = 201;
        res.json({
            Id : result.insertId
        });
        //socket send new list request from client
        managerRepo.getRequestByStatus(config.Status.Request).then(data => {
            ioSocket.sockets.in(config.App2.Room).emit('listRequestLocation',data);
        }).catch(errGet => {
            ioSocket.sockets.in(config.App2.Room).emit('listRequestLocation',[]);
        });
    }).catch(err => {
        res.statusCode = 404;
        res.json({
            ErrorMessage : 'insert faild',
            ErrorModel : err,
        });
    });
});
router.get('/receiverRequest/:id',(req,res) => {
    var status = +req.params.id;
    managerRepo.getRequestByStatus(status).then(result => {
        res.statusCode = 200;
        res.json(result);
    }).catch(err => {
        res.statusCode = 404;
        res.json({
            ErrorMessage : 'get faild',
            ErrorModel : err,
        });
    });
});
router.get('/requestManagement',(req,res) => {
    //var status = +req.params.id;
    managerRepo.getRequestManagement().then(result => {
        res.statusCode = 200;
        res.json(result);
    }).catch(err => {
        res.statusCode = 404;
        res.json({
            ErrorMessage : 'get faild',
            ErrorModel : err,
        });
    });
});
router.post('/ReverseLocation',(req,res) => {
    var model = req.body || {};
    managerRepo.updateReverseLocation(model).then(result => {
        res.statusCode = 201;
        res.json({
            result
        });
        //socket send new list request from client
        managerRepo.getRequestByStatus(config.Status.Request).then(data => {
            ioSocket.sockets.in(config.App2.Room).emit('listRequestLocation',data);
        }).catch(errGet => {
            ioSocket.sockets.in(config.App2.Room).emit('listRequestLocation',[]);
        });
        //socket send new list for app3
        managerRepo.getRequestManagement().then(dataApp3 => {
            ioSocket.sockets.in(config.App3.Room).emit('listApp3',dataApp3);
        }).catch(errApp3 => {
            ioSocket.sockets.in(config.App3.Room).emit('listApp3',[]);
        });
    }).catch(err => {
        console.log(err);
        res.statusCode = 404;
        res.json({
            ErrorMessage : 'insert faild',
            ErrorModel : err,
        });
    });
});


router.get('/locationdrive/:id',(req,res) => {
    var id = +req.params.id;
    managerRepo.getDriverRequestByRequestId(id).then(result => {
        res.statusCode = 200;
        res.json(result);
    }).catch(err => {
        res.statusCode = 404;
        res.json({
            ErrorMessage : 'get faild',
            ErrorModel : err,
        });
    });
});



module.exports = function(io){
    ioSocket = io;
    return router;
}


