DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

create table products (
item_id integer not null auto_increment,
product_name varchar(100),
department_name varchar(50),
price decimal(20,2),
stock_quantity integer(20),
primary key(item_id)
);

insert into products ( product_name, department_name, price, stock_quantity)
values ( "iphone8", "electronics", 899.00, 5),
( "dot a art", "arts and crafts", 38.00, 100),
( "handbag", "women", 50.00, 6),
( "solar lights outdoor", "home improvement", 39.99, 150),
( "echo dot", "bmazon devices", 49.99, 65),
( "Wireless Security Camera Indoor", "Electronics", 42.49, 35),
( "The Alchemist", "Books", 12.79, 500),
( "Quiet", "Books", 15.50, 300),
( "Blender", "appliance", 49.00, 16),
( "pens", "stationary", 4.00, 500);