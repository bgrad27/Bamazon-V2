// Initializes packages
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Initializes connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3454,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

// Creating connection to load server
connection.connect(function (err) {
    if (err) {
        console.error("Error: " + err.stack);
    }
    loadProducts();
});

// Function to get prodcuts to render in console
function loadProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        // Load the possible manager menu Prompt, pass in the products data
        loadManagerPrompt(res);
    });
}

// Load the manager Prompt and pass in the products data from the database
function loadManagerPrompt(products) {
    inquirer
        .prompt({
            type: "list",
            name: "choice",
            choices: ["Products for Sale", "What product is  on inventory", "Add to Inventory", "Add New Product", "Quit"],
            message: "What's the move el hefe?"
        })
        .then(function (val) {
            switch (val.choice) {
                case "View Products for Sale":
                    console.table(products);
                    loadProducts();
                    break;
                case "What product is  on inventory":
                    loadInventory();
                    break;
                case "Add to Inventory":
                    addToInventory(products);
                    break;
                case "Add New Product":
                    promptManagerForNewProduct(products);
                    break;
                default:
                    console.log("See yah!");
                    process.exit(0);
                    break;
            }
        });
}

// run a funciton to load the inventory
function loadInventory() {
    // Show any product that has lower than 5 products in the inventory
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        // show the table with the results and run the loadProducts function
        console.table(res);
        loadProducts();
    });
}

// Make a prompt for the manager to add to the inventory
function addToInventory(inventory) {
    console.table(inventory);
    inquirer
        .prompt([
            {
                type: "input",
                name: "choice",
                message: "What is the product of the ID that you want to add inventory to?",
                validate: function (val) {
                    return !isNaN(val);
                }
            }
        ])
        .then(function (val) {
            var choiceId = parseInt(val.choice);
            var product = checkInventory(choiceId, inventory);

            // If they enter the right id
            if (product) {
                // Pass the chosen product to promptCustomerForQuantity
                promptManagerForQuantity(product);
            }
            else {
                // run a message if they don't choose a matching id
                console.log("\nThat item is not in the inventory.");
                loadProducts();
            }
        });
}

// Ask for the quantity that should be added to the chosen product
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

// Updates quantity
function addQuantity(product, quantity) {
    connection.query(
        "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
        [product.stock_quantity + quantity, product.item_id],
        function (err, res) {
            // Run a log to know it worked
            console.log("\nSuccessfully added " + quantity + " " + product.product_name + "'s!\n");
            loadProducts();
        }
    );
}

// Runs a prompt to ask questions to manager
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
            // When done, re run loadProducts, effectively restarting our app
            loadProducts();
        }
    );
}

// Make an array for departments
function getDepartments(products) {
    var departments = [];
    for (var i = 0; i < products.length; i++) {
        if (departments.indexOf(products[i].department_name) === -1) {
            departments.push(products[i].department_name);
        }
    }
    return departments;
}

// Checks to see if the users choice matches an id we have in the db
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