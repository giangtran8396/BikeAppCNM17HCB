var db = require('../fn/mysql-db');

exports.receiverRequest = function(req){
    var sql = `INSERT INTO request(Name,Phone,address,Location1,Note,CreateDate,Status) 
    VALUES ('${req.UserName}','${req.PhoneNumber}','${req.Address}','${req.Location1}','${req.Note}',NOW(),'${1}')`;
    return db.write(sql);
}

exports.getRequestByStatus = function(status){
    var sql = `SELECT Id, Name, Phone, Address, Location1, Location2, Note, CreateDate, Status FROM request
    WHERE Status = ${status}
    ORDER BY Id`;
    return db.load(sql);
}

exports.updateReverseLocation = function(req){
    var sql = `UPDATE request
    SET Location2 = '${req.Location2}',
    Status = ${req.Status}
    WHERE Id = ${req.Id}`
    return db.write(sql);
}

exports.getRequestManagement = function(){
    var sql = `SELECT Id, Name,Phone,Status,Address FROM request
    WHERE Status != 1
    ORDER BY Id`;
    return db.load(sql);
}



exports.getDriverRequestByRequestId = function(id){
    var sql = `SELECT user.ID,user.Name,driver.Location,request.Phone FROM requestdriver 
    INNER JOIN driver ON driver.ID = requestdriver.IDDriver
    INNER JOIN user ON user.ID = driver.IDUser
    INNER JOIN request ON request.Id = requestdriver.IDRequest
    WHERE requestdriver.IDRequest = ${id} AND user.Role = 3`;
    return db.load(sql);
}