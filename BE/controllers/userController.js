var express = require('express');
var jwt = require('jsonwebtoken');
var userRepo = require('../repos/userRepo');
var bcrypt = require('bcrypt');

var router = express.Router();

router.post('/login',(req,res) => {
    var userModel = req.body || {};
        userRepo.loginUser(userModel).then(result => {
            bcrypt.compare(userModel.Password,result[0].Password,(err,resCompare) => {
                 if(resCompare){
                    res.statusCode = 200;
                    var userEntity = {
                        ID : result[0].ID,
                        Name : result[0].Name,
                        Role : result[0].Role
                    }
                    var acToken = jwt.sign(userEntity, 'BikeApp17HCBSECERT', {
                        expiresIn: '1d' // seconds
                    });
                    res.json({
                        userEntity,
                        access_token:acToken,
                    });
                 }
                 else{
                    res.statusCode = 404;
                    res.json({
                        ErrorMessage : 'login faild'
                    });
                 }
            });
        }).catch(err => {
            res.statusCode = 404;
            res.json({
                ErrorMessage : 'unexpected error',
                ErrorModel : err,
            });
        });
});

module.exports = router;