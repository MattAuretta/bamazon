CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NULL,
department_name VARCHAR(100) NULL,
price DECIMAL(10,2) NULL,
stock_quantity INT(11) NULL,
PRIMARY KEY (item_id)
);

CREATE TABLE departments(
department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(100) NULL,
over_head_costs INT(11) NULL,
PRIMARY KEY (department_id)
);

ALTER TABLE products
MODIFY product_sales DECIMAL(10,2) DEFAULT "0.00";

SELECT * FROM products;
SELECT * FROM departments;

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Sporting Goods", 3000);

DELETE FROM products WHERE product_name = "Loose Herbal Tea";

UPDATE products
SET price = 2.99
WHERE product_name = "Herbal Tea";

