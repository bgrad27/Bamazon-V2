--Just copied and pasted schema from Bamazon Customer
--Create Datebase to hold products--
DROP DATABASE IF EXIST bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    id INT AUTO-INCREMENT NOT NULL
    product_name VARCHAR(30) NOT NULL,
    department VARCHAR(30) NOT NULL,
    price DECIMAL(10,2)
    quantity INT(10) NOT NULL,
    primary key(id)
);
--Create actual products--
SELECT * FROM products;

INSERT INTO products(product_name, department, price, quantity)
VALUES("Hat", "Clothing", 20.99, 100);

INSERT INTO products(product_name, department, price, quantity)
VALUES("Flannel Shirt", "Clothing", 30.50, 25);

INSERT INTO products(product_name, department, price, quantity)
VALUES("Laptop", "Electronics", 899.99, 20);

INSERT INTO products(product_name, department, price, quantity)
VALUES("TV", "Electronics", 299.79, 50);

INSERT INTO products(product_name, department, price, quantity)
VALUES("Basketball", "Sports", 30.00, 200);

INSERT INTO products(product_name, department, price, quantity)
VALUES("Bat", "Sports", 200.99, 70);

INSERT INTO products(product_name, department, price, quantity)
VALUES("Glove", "Sports", 149.99, 120);

INSERT INTO products(product_name, department, price, quantity)
VALUES("Necklace", "Jewerly", 400.99, 10);

INSERT INTO products(product_name, department, price, quantity)
VALUES("Ring", "Jewerly", 2000.99, 30);

INSERT INTO products(product_name, department, price, quantity)
VALUES("s", "Jewerly", 5000.99, 20);
