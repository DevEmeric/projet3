const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'serversql',
  database : 'pimp_my_cake_admin'
});
module.exports  =  connection;
