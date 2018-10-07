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
    runApp();
});

function runApp() {
    inquirer.prompt({
        name: "confirm",
        type: "confirm",
        message: "Would you like to see our available products?",
        default: true
    }).then(function (answer) {
        if (answer.confirm) {
            //Query to database to get all item info
            var query = "SELECT item_id, product_name, price FROM products";
            connection.query(query, function (err, response) {
                //Loop through response
                for (var i = 0; i < response.length; i++) {
                    //Log each item id, name, and price
                    console.log("Item ID: " + response[i].item_id + "    Product: " + response[i].product_name + "    Price: $" + response[i].price);
                }
                console.log("---------------------")
                //Run function that asks what customer wants to purchase
                purchaseItems();
            });
        } else {
            console.log("Come back soon!");
            connection.end();
        };
    });
};

function purchaseItems() {
    inquirer
        .prompt([{
                name: "id",
                type: "input",
                message: "Enter the ID of the product you wish to buy: ",
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
                message: "Enter the amount of units you would like to buy: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    };
                    return false;
                }
            }
        ])
        .then(function (answer) {
            //Query to database to get specific item info
            var query = "SELECT item_id, stock_quantity, price FROM products WHERE ?";
            connection.query(query, {
                        item_id: answer.id
                    },
                function (err, response) {
                    //If requested units is more than stock quantity
                    if (response[0].stock_quantity < answer.units) {
                        console.log("Insufficient quantity!")
                        runApp();
                    } else {
                        //Variable to hold logic for updated stock
                        var updateStock = response[0].stock_quantity - answer.units
                        //Update stock quantity in database
                        connection.query("UPDATE products SET stock_quantity = " + updateStock + " WHERE ?", {
                                item_id: answer.id
                            });
                        //Display total cost
                        console.log("Your order total is: $" + (answer.units * response[0].price));
                        console.log("---------------------")
                        runApp();
                    };
                });
        });
};