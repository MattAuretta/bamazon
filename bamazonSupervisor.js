//Require npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

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

function runSupervisor() {
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Product Sales by Department",
            "Create New Department",
            "Quit"
        ]
    }).then(function (response) {
        switch (response.options) {
            case "View Product Sales by Department":
                viewByDepartment();
                break;
            case "Create New Department":
                createDepartment();
                break;
            case "Quit":
                connection.end();
                break;
        }
    });
};

function viewByDepartment() {
    var query = "SELECT departments.department_id, products.department_name, departments.over_head_costs, SUM(products.product_sales), departments.department_name, "
    query += "SUM(products.product_sales - departments.over_head_costs) AS total_profit ";
    query += "FROM products INNER JOIN departments ON (products.department_name = departments.department_name) GROUP BY departments.department_id ORDER BY departments.department_id";
    connection.query(query, function (err, res) {
        var inventory = [];
        for (var i = 0; i < res.length; i++) {
            inventory.push(res[i])
        }
        console.log("\n")
        console.table(inventory);
        runSupervisor();
    });
};


function createDepartment() {

};