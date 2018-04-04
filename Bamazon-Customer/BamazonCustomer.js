// Get the packages
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Connect with mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // My username
    user: "root",


    password: "",
    database: "bamazon"
});

// Creates connect, if theres an error we're going to log Error
connection.connect(function (err) {
    if (err) {
        console.error("Error: " + err.stack);
    }
    loadProducts();
});

// Create a function to load the table
function loadProducts() {
    // This will select the data from schema
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        // Just build table
        console.table(res);

        // Run prompt function
        promptCustomerForItem(res);
    });
}

// Prompt user
function promptCustomerForItem(inventory) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "choice",
                message: "What is the ID of the item you would you like to purchase? [Quit with Q]",
                validate: function (val) {
                    return !isNaN(val) || val.toLowerCase() === "q";
                }
            }
        ])
        .then(function (val) {
            // Allow the user to quit
            checkIfShouldExit(val.choice);
            var choiceId = parseInt(val.choice);
            var product = checkInventory(choiceId, inventory);

            // If else statement to see if user picks an id in the db
            if (product) {

                promptCustomerForQuantity(product);
            }
            else {
                // Otherwise let them know the item is not in the inventory, re-run loadProducts
                console.log("\nThat item is not in the inventory.");
                loadProducts();
            }
        });
}

// Prompt the customer for a product quantity
function promptCustomerForQuantity(product) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "quantity",
                message: "How many would you like? [Quit with Q]",
                validate: function (val) {
                    return val > 0 || val.toLowerCase() === "q";
                }
            }
        ])
        .then(function (val) {
            // Check if the user wants to quit the program
            checkIfShouldExit(val.quantity);
            var quantity = parseInt(val.quantity);

            // If there isn't enough of the product let the user know and bring them back back to the start of the prompt
            if (quantity > product.stock_quantity) {
                console.log("\nInsufficient quantity!");
                loadProducts();
            }
            else {

                makePurchase(product, quantity);
            }
        });
}

// Remove the amount the user decides to purchase
function makePurchase(product, quantity) {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantity, product.item_id],
        function (err, res) {
            // Show user that transaction was succesful
            console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
            loadProducts();
        }
    );
}

// See if product exist in inventory
function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
            // If a matching product is found, return the product
            return inventory[i];
        }
    }
    // Otherwise return null
    return null;
}

// Check to see if the user wants to quit the program
function checkIfShouldExit(choice) {
    if (choice.toLowerCase() === "q") {
        // Log a message and exit the current node process
        console.log("See yah!");
        process.exit(0);
    }
}