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
    console.log("---------------------\nAll products for sale:\n");
    //Query to database to get info for all items
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(query, function (err, response) {
        //Loop through each item
        for (var i = 0; i < response.length; i++) {
            //Log each item id, name, price, and quantity
            console.log("Item ID: " + response[i].item_id + " || Product: " + response[i].product_name + " || Price: $" + response[i].price + " || Quantity: " + response[i].stock_quantity);
        };
        console.log("\n---------------------\n");
        //Run main function again
        runManager();
    });
};

function viewLowInventory() {
    console.log("---------------------\nAll items with a low inventory:\n");
    var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, response) {
        //Loop through each item
        for (var i = 0; i < response.length; i++) {
            //Log each item name and quantity
            console.log("Item ID: " + response[i].item_id + " || Product: " + response[i].product_name + " || Quantity: " + response[i].stock_quantity);
        };
        console.log("\n---------------------\n");
        //Run main function again
        runManager();
    });
}