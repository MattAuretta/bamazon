# Bamazon

## Description
Bamazon is a Node.js application that utilizes MySQL to create a command line storefront using npm inquirer, npm mysql, and npm cli-table. This application has three separate interfaces: **Customer**, **Manager**, and **Supervisor**

## Installation
To use this application you will need a MySQL database set up. If you do not have MySQL installed on your machine you can download it [here](https://dev.mysql.com/downloads/installer/). Once MySQL is up and running, you will need to create a database named *bamazonDB* and then use the code found in the bamazonDB.sql file to create a *products* and *departments* table.
You will also need to install [Node.js](https://nodejs.org/en/) if it is not already installed on your machine.
After cloning the repository, you will need to do a few npm installs:
```
    npm install inquirer
    npm install mysql
    npm install cli-table
```
## Customer
The Customer interface will ask the user if they wish to see all available products for sale and then display each product id, product name, and price if the user wishes to see this information. The application will then ask the user which product they would like to purchase as well as the quantity. If there is not enough stock of said item, the app will display *Insufficient Quantity.*
Product Sales and Stock Quantity are updated in the MySQL database for every purchase.

Entering `node bamazonCustomer.js` in your terminal will run this application.

## Manager
The Manager interface will list four options for the user to choose from:
- View Products For Sale
  - A table will be displayed showing every available item ID, name, price, and quantity.
- View Low Inventory
  - A table will be displayed showing all items with an inventory count lower than 5.
- Add to Inventory
  -  A prompt will be displayed asking the user which item they would to add inventory to and the quanity they would like to add. Stock Quantity of the chosen item will be dynamically updated in the *products* table.
- Add New Product
  -  A prompt will be displayed asking the user for the product name, department, price, and quantity they would like to add. This information is added into the *products* table.
  
Entering `node bamazonManager.js` in your terminal will run this application.

## Supervisor
The Supervisor interface utilizes the *products* and *departments* tables together and will prompt the user with two options to choose from:
- View Products Sales by Department
  -  A table will displayed showing each department name as well as the over head costs, product sales, and total profit for that department.
- Create New Department
  - A prompt will ask the user the name of the new department they wish to add to the *departments* table as well as the over head costs for that department.
  
Entering `node bamazonSupervisor.js` in your terminal will run this application.
