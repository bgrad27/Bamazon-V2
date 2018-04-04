// Need to require mysql to run database, inquirer for the prompt I'm going to run on the command line, and lastly console.table to show a table in my commandline
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Connect host with mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

// Connects server
connection.connect(function (err) {
    if (err) {
        console.error("Error: " + err.stack);
    }
    loadProducts();
});