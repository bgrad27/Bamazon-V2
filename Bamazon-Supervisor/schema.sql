DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  primary key(item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Hat", "Clothing", 20.99, 100),
  ("Flannel Shirt", "Clothing", 30.50, 50),
  ("Laptop", "Electronics", 899.99, 20),
  ("TV", "Electronics", 299.79, 50),
  ("Basketball", "Sports", 30.00, 200),
  ("Bat", "Sports", 200.99, 70),
  ("Glove", "Sports", 149.99, 120),
  ("Necklace", "Jewerly", 400.99, 10),
  ("Ring", "Jewerly", 2000.99, 30),
  ("Bracelet", "Jewerly", 5000.99, 20);
  

  CREATE TABLE departments(
  department_id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs DECIMAL(10,2) NOT NULL,
  primary key(department_id)
);

SELECT * FROM departments;

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Clothing", 100),
  ("Electronics", 200),
  ("Sports", 50),
  ("Jewerly", 300);


  