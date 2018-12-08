var db = require('../fn/mysql-db');

exports.receiverRequest = function(req){
    var sql = `INSERT INTO request(Name,Phone,address,Location1,Note,Status) 
    VALUES ('${req.UserName}','${req.PhoneNumber}','${req.Address}','${req.Location1}','${req.Note}','${1}')`;
    return db.write(sql);
}