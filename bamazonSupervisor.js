//Require npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");

//Create connection to MySQL database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    runSupervisor();
});

function runSupervisor(){
    console.log("connection successful");
};