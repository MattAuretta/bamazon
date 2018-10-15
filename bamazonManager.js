//Require npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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
    runManager();
});

function runManager() {
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products For Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Quit"
        ]
    }).then(function (response) {
        switch (response.options) {
            case "View Products For Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Quit":
                connection.end();
                break;
        }
    });
};

function viewProducts() {
    console.log("---------------------\nAll products for sale:");
    //Query to database to get info for all items
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(query, function (err, response) {
        var table = new Table ({
            head: ["Product Id", "Product Name", "Price", "Stock Quantity"],
            colWidths: [20, 20, 20, 20]
        });
        //Loop through each item
        for (var i = 0; i < response.length; i++) {
            //Log each item id, name, price, and quantity
            table.push([response[i].item_id, response[i].product_name, "$" + response[i].price, response[i].stock_quantity]);
        };
        console.log("\n" + table.toString() + "\n");
        //Run main function again
        runManager();
    });
};

function viewLowInventory() {
    console.log("---------------------\nAll items with a low inventory:\n");
    var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5";
    var table = new Table ({
            head: ["Product Id", "Product Name", "Stock Quantity"],
            colWidths: [20, 20, 20]
        });
    connection.query(query, function (err, response) {
        //Loop through each item
        for (var i = 0; i < response.length; i++) {
            //Log each item id, name, and quantity
            table.push([response[i].item_id, response[i].product_name, response[i].stock_quantity]);
        };
        console.log("\n" + table.toString() + "\n");
        //Run main function again
        runManager();
    });
};

function addInventory() {
    inquirer
        .prompt([{
                name: "id",
                type: "input",
                message: "Enter the ID of the product you wish to add inventory to: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "units",
                type: "input",
                message: "Enter the amount of units you would like to add: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    };
                    return false;
                }
            }
        ]).then(function (answer) {
            var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE ?";
            connection.query(query, {
                    item_id: answer.id
                },
                function (err, response) {
                    //Variable to hold logic for updated stock
                    var updateStock = parseInt(response[0].stock_quantity) + parseInt(answer.units);
                    //Update stock quantity in database
                    connection.query("UPDATE products SET stock_quantity = " + updateStock + " WHERE ?", {
                        item_id: answer.id
                    });
                    //Display total cost
                    console.log("\nYour updated inventory of " + response[0].product_name + " is: " + updateStock + "\n");
                    runManager();
                });
        });
};

function addProduct() {
    inquirer
        .prompt([{
                name: "product",
                type: "input",
                message: "Enter the name of the product you wish to add: "
            },
            {
                name: "department",
                type: "input",
                message: "Enter the name of the department for this product: "
            },
            {
                name: "price",
                type: "input",
                message: "Enter the price of this product: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    };
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "Enter the number of units you wish to add to the inventory: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    };
                    return false;
                }
            }
        ]).then(function (answer) {
            //Query to database to insert new product
            var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ( '" + answer.product + "', '" + answer.department + "', " + answer.price + ", " + answer.quantity + ")";
            connection.query(query, function(err, response){
                if(response){
                    console.log("\nYou've successfully added " + answer.product + " to your available products.\n");
                    runManager();
                } else {
                    console.log("Invalid parameters, try again.");
                    runManager();
                }
            });
        });
};