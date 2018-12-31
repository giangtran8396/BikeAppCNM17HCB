var db = require('../fn/mysql-db');

exports.updateStatusRequest = function(req){
    var sql = `UPDATE request
    SET Status = ${req.Status}
    WHERE IDUser = ${req.Id}`
    return db.write(sql);
}

exports.receiverDriverRequest = function(req){
    var sql = `INSERT INTO requestdriver(IDDriver,IDRequest) 
    VALUES ('${req.IDDriver}','${req.IDRequest}',${1}')`;
    return db.write(sql);
}

exports.updateLocationDriver = function(req){
    var sql = `UPDATE driver
    SET Location = '${req.Location}'
    WHERE IDUser = ${req.Id}`
    return db.write(sql);
}

exports.updateStatusDriver = function(req){
    var sql = `UPDATE driver
    SET Status = ${req.Status}
    WHERE IDUser = ${req.Id}`
    return db.write(sql);
}

exports.getStatusDriver = function(req){
    var sql = `SELECT Status
    FROM driver
    WHERE IDUser = ${req.Id}`
    return db.write(sql);
}

exports.getRequest = function(status){
    var sql = `SELECT Id, Name, Phone, Address, Location1, Location2, Note, CreateDate, Status FROM request
    WHERE Status = ${status}
    ORDER BY Id
    LIMIT 1`;
    return db.load(sql);
}
