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
    var query = "SELECT departments.department_id, products.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, departments.department_name, "
    query += "SUM(products.product_sales) - departments.over_head_costs AS total_profit ";
    query += "FROM products INNER JOIN departments ON (products.department_name = departments.department_name) GROUP BY departments.department_id ORDER BY departments.department_id";
    connection.query(query, function (err, res) {
        var table = new Table ({
            head: ["Department Id", "Department Name", "Over Head Costs", "Product Sales", "Total Profit"],
            colWidths: [20, 20, 20, 20, 20]
        });
        
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]);
        }

        console.log("\n" + table.toString() + "\n");
        runSupervisor();
    });
};


function createDepartment() {
    inquirer
        .prompt([{
                name: "name",
                type: "input",
                message: "Enter the name of the department you wish to add: "
            },
            {
                name: "overhead",
                type: "input",
                message: "Enter the over head costs of this department: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    };
                    return false;
                }
            }
        ]).then(function (answer) {
            //Query to database to insert new product
            var query = "INSERT INTO departments (department_name, over_head_costs) VALUES ( '" + answer.name + "', " + answer.overhead + ")";
            connection.query(query, function(err, response){
                if(response){
                    console.log("\nYou've successfully added " + answer.name + " to your current departments.\n");
                    runSupervisor();
                } else {
                    console.log("Invalid parameters, try again.");
                    runSupervisor();
                }
            });
        });
 
};