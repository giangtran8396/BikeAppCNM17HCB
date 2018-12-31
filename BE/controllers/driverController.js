var ioSocket;
var config = require('../config/config')
var express = require('express');
var driverRepo = require('../repos/driverRepo');
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
    if (model.Status == 1){
        driverRepo.getRequest(2).then(dataApp4 => {
            ioSocket.sockets.in(config.App4.Room).emit('listApp4',dataApp4);
        }).catch(errApp4 => {
            ioSocket.sockets.in(config.App4.Room).emit('listApp4',[]);
        });
    }       
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

