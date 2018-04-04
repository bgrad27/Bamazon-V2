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

function customerQuestions(inventory) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "itemPicked",
                message: "What product do you want? If you'd like to quit press q",
                validate: function (val) {
                    return val > 0 || val.toLowerCase() === 'q';
                }
            }
        ])
    then(function (val) {
        userExit(val.quantity);
        var quantity = parseInt(val.quantity);
        //Make an if statement that stops user when they select more of a product than is availabe, and restart prompt
        if (quantity > product.product_quantity) {
            console.log("Insuffient quantity");
            loadProducts();
            //If they select correct amount run makePurchase function
        } else {
            makePurchase(product, quantity);
        }
    });
}
//Now to make a function that continues the prompt and allows user to make a purchase
function makePurchase() {
    connection.query(
        "UPDATE products SET product_quantity - ? WHERE id = ?",
        [quantity, product.id],
        function (err, res) {
            console.log("\nSuccessful Purchase " + quantity + " " + product.name);
            loadProducts();
        }
    );
}

// Check to see if we actually have the product the user requested
function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
            // return the product if there is a match
            return inventory[i];
        }
    }
    // If not return null
    return null;
}

// Ask user if they're done
function checkIfShouldExit(choice) {
    if (choice.toLowerCase() === "q") {
        // Log a message and exit the current node process
        console.log("Thank you, goodbye!");
        process.exit(0);
    }
}