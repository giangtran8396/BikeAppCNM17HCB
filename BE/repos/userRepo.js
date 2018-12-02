var db = require('../fn/mysql-db');

exports.createUser = function(user){
    var sql = `INSERT INTO user(UserName,Password,Name,Role) 
    VALUES ('${user.UserName}','${user.Password}','${user.Name}','${user.Role}')`;
    return db.write(sql);
}

exports.loginUser = function(user){
    var sql = `SELECT Name , UserName , Password , Role FROM user WHERE UserName = '${user.UserName}'`;
    return db.load(sql);
}