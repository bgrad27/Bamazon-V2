// Need to require mysql to run database, inquirer for the prompt I'm going to run on the command line, and lastly console.table to show a table in my commandline
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Connect host with mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 3200,

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

//Function to get products to render in console
function loadProducts() {
    connection.query("Select * FROM products", function (err, res) {
        //If error display error message
        if (err) throw (err);
        //this will post results in table
        console.table(res);
        //This will run the prompt if the loadProducts function isn't an error
        customerQuestions(res);
    });
}

//Now to write prompt