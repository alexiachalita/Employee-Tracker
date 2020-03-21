// Add Dependencies
var mysql = require("mysql");
var inquire = require("inquirer");
var cTable = require("console.table");

// Create DB Connections
var connection = mysql.createConnection({
host: "localhost",

//PORT 
port: 3306,

//Username
user: "root",

//Password
password: "root",
database: "companyDB",
});

//If Connection Fails
connection.connect(function(err) {
if (err) throw err;
console.log("connected as id" + connection.threadId + "\n");
//maybe call another function here
});


