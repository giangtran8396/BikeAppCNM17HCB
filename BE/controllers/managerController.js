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
    }).catch(err => {
        res.statusCode = 404;
            res.json({
                ErrorMessage : 'insert Faild',
                ErrorModel : err,
            });
    });
})

module.exports = router;
