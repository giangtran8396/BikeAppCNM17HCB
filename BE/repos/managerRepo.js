var db = require('../fn/mysql-db');

exports.receiverRequest = function(req){
    var sql = `INSERT INTO request(Name,Phone,address,Location1,Note,Status) 
    VALUES ('${req.UserName}','${req.PhoneNumber}','${req.Address}','${req.Location1}','${req.Note}','${1}')`;
    return db.write(sql);
}

exports.getRequestByStatus = function(status){
    var sql = `SELECT Id, Name, Phone, Address, Location1, Location2, Note, Status FROM request
    WHERE Status = ${status}
    ORDER BY Id`;
    return db.load(sql);
}

exports.getRequestManagement = function(){
    var sql = `SELECT Name,Phone,Status FROM request
    ORDER BY Id`;
    return db.load(sql);
}