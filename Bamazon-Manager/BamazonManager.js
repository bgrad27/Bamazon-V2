// Requires
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// Creates connection for manager menu
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
    }
    loadManagerMenu();
});

// Get products
function loadManagerMenu() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        // Manager options
        loadManagerOptions(res);
    });
}

// Load Manger options
function loadManagerOptions(products) {
    inquirer
        .prompt({
            type: "list",
            name: "choice",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
            message: "What would you like to do?"
        })
        .then(function (val) {
            switch (val.choice) {
                case "View Products for Sale":
                    console.table(products);
                    loadManagerMenu();
                    break;
                case "View Low Inventory":
                    loadLowInventory();
                    break;
                case "Add to Inventory":
                    addToInventory(products);
                    break;
                case "Add New Product":
                    promptManagerForNewProduct(products);
                    break;
                default:
                    console.log("Goodbye!");
                    process.exit(0);
                    break;
            }
        });
}

// DB for showing low inventory
function loadLowInventory() {
    // Selects all of the products that have a quantity of 5 or less
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        // Draw the table in the terminal using the response, load the manager menu
        console.table(res);
        loadManagerMenu();
    });
}

// Prompt the manager for a product to replenish
function addToInventory(inventory) {
    console.table(inventory);
    inquirer
        .prompt([
            {
                type: "input",
                name: "choice",
                message: "What is the ID of the item you would you like add to?",
                validate: function (val) {
                    return !isNaN(val);
                }
            }
        ])
        .then(function (val) {
            var choiceId = parseInt(val.choice);
            var product = checkInventory(choiceId, inventory);

            // If else if product id is correct
            if (product) {
                promptManagerForQuantity(product);
            }
            else {
                console.log("\nThat item is not in the inventory.");
                loadManagerMenu();
            }
        });
}

// Ask for the quantity that should be added
function promptManagerForQuantity(product) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "quantity",
                message: "How many would you like to add?",
                validate: function (val) {
                    return val > 0;
                }
            }
        ])
        .then(function (val) {
            var quantity = parseInt(val.quantity);
            addQuantity(product, quantity);
        });
}

// Updates quantity of selected product
function addQuantity(product, quantity) {
    connection.query(
        "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
        [product.stock_quantity + quantity, product.item_id],
        function (err, res) {
            // Let them know that product was added
            console.log("\nSuccessfully added " + quantity + " " + product.product_name + "'s!\n");
            loadManagerMenu();
        }
    );
}

//Ask product questions
function promptManagerForNewProduct(products) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "product_name",
                message: "What is the name of the product you would like to add?"
            },
            {
                type: "list",
                name: "department_name",
                choices: getDepartments(products),
                message: "Which department does this product fall into?"
            },
            {
                type: "input",
                name: "price",
                message: "How much does it cost?",
                validate: function (val) {
                    return val > 0;
                }
            },
            {
                type: "input",
                name: "quantity",
                message: "How many do we have?",
                validate: function (val) {
                    return !isNaN(val);
                }
            }
        ])
        .then(addNewProduct);
}

// Adds a new product to the database, loads the manager menu
function addNewProduct(val) {
    connection.query(
        "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
        [val.product_name, val.department_name, val.price, val.quantity],
        function (err, res) {
            if (err) throw err;
            console.log(val.product_name + " ADDED TO BAMAZON!\n");
            // When done, re run loadManagerMenu, effectively restarting our app
            loadManagerMenu();
        }
    );
}

// Take an array of product objects, return an array of their unique departments
function getDepartments(products) {
    var departments = [];
    for (var i = 0; i < products.length; i++) {
        if (departments.indexOf(products[i].department_name) === -1) {
            departments.push(products[i].department_name);
        }
    }
    return departments;
}

// Check to see if the product the user chose exists in the inventory
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