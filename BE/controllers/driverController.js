var ioSocket;
var config = require('../config/config')
var express = require('express');
var driverRepo = require('../repos/driverRepo');
var managerRepo = require('../repos/managerRepo');
var router = express.Router();

router.put('/updatelocationdriver',(req,res) => {
    var model = req.body || {};
    driverRepo.updateLocationDriver(model).then(result => {
        res.statusCode = 201;
        res.json({
            result
        });
    }).catch(err => {
        console.log(err);
        res.statusCode = 404;
        res.json({
            ErrorMessage : 'update faild',
            ErrorModel : err,
        });
    });
});

router.put('/updatestatusrequest',(req,res) => {
    var model = req.body || {};
    driverRepo.updateStatusRequest(model).then(result => {
        res.statusCode = 201;
        res.json({
            result
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
            ErrorMessage : 'update faild',
            ErrorModel :  err,
        });
    });
});

router.put('/updatestatusdriver',(req,res) => {
    var model = req.body || {};
    driverRepo.updateStatusDriver(model).then(result => {
        res.statusCode = 201;
        res.json({
            result
        });  
    }).catch(err => {
        console.log(err);
        res.statusCode = 404;
        res.json({
            ErrorMessage : 'update faild',
            ErrorModel : err,
        });
    });
});

router.post('/receiverDriverRequest',(req,res) => {
    var model = req.body || {};
    driverRepo.receiverDriverRequest(model).then(result => {
        res.statusCode = 201;
        res.json({
            result
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

router.post('/getStatusDriver',(req,res) => {
    var model = req.body || {};
    driverRepo.getStatusDriver(model).then(result => {
        res.statusCode = 200;
        res.json(result);
    }).catch(err => {
        console.log(err);
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

