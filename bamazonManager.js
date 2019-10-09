var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "rootroot",
	database: "bamazon_db"
});


connection.connect(function (err) {
	if (err) throw err;
	displayMenu();
});

function displayMenu() {
	inquirer
		.prompt([
			{
				type: "list",
				name: "Menu",
				message: "Choose you option from the below menu???",
				choices: [
					"a: View Products for Sale",
					"b: View Low Inventory",
					"c: Add to Inventory",
					"d: Add New Product",
					"e: Exit"
				]
			}
		])
		.then(function (choice) {
			switch (choice.Menu) {
				case "a: View Products for Sale":
					viewProductsForSale();
					break;
				case "b: View Low Inventory":
					viewLowInventory();
					break;
				case "c: Add to Inventory":
					addToInventory();
					break;
				case "d: Add New Product":
					addNewProduct();
					break;
				case "e: Exit":
					process.exit();
					break;
			}
		});
}

function viewProductsForSale() {

	connection.query('SELECT * FROM Products', function (err, res) {
		if (err) { console.log(err) };
		var theDisplayTable = new Table({
			head: ['Item ID', 'Product Name', 'Category', 'Price', 'Quantity'],
			colWidths: [10, 25, 25, 10, 14]
		});
		for (var i = 0; i < res.length; i++) {
			theDisplayTable.push(
				[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
			);
		}
		console.log(theDisplayTable.toString());
		displayMenu();
	});
}

function viewLowInventory() {

	connection.query("select * from products where stock_quantity<5", function (err, res) {
		if (err) throw err;
		console.log("Items with inventory count lower than five.");
		var theDisplayTable = new Table({
			head: ['Item ID', 'Product Name', 'Category', 'Price', 'Quantity'],
			colWidths: [10, 25, 25, 10, 14]
		});
		for (var i = 0; i < res.length; i++) {
			theDisplayTable.push(
				[res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
			);
		}
		console.log(theDisplayTable.toString());
		displayMenu();
	});
}

function addToInventory() {
	connection.query("select * from products ", function (err, res) {
		if (err) throw err;

		var theDisplayTable = new Table({
			head: ['Item ID', 'Product Name', 'Quantity'],
			colWidths: [10, 25, 15]
		});
		for (var i = 0; i < res.length; i++) {
			theDisplayTable.push(
				[res[i].item_id, res[i].product_name, res[i].stock_quantity]
			);
		}
		console.log(theDisplayTable.toString());

		inquirer
			.prompt([
				{
					type: "input",
					name: "product",
					message: "Select the product to add to inventory??"
				},
				{
					type: "input",
					name: "quantity",
					message: "What is the quantity of inventory??"
				}
			])
			.then(function (answer) {
				var product = answer.product;
				var quantity = parseInt(answer.quantity);
				buildNewItem(product, quantity);
			});
	});

	function buildNewItem(product, quantity) {

		connection.query(`UPDATE products SET ? WHERE ?`,
			[
				{
					stock_quantity: quantity
				}, {
					product_name: product
				}
			],
			function (err, res) {
				if (err) throw err;

				displayMenu();

			})
	}
}

////////////////////
function addNewProduct() {

	inquirer
		.prompt([
			{
				type: "input",
				name: "product_name",
				message: "Enter the name of product to add??"
			},
			{
				type: "input",
				name: "department_name",
				message: "Enter the department of product to add??"
			},
			{
				type: "input",
				name: "price",
				message: "Enter the price of product to add??"
			},
			{
				type: "input",
				name: "stock_quantity",
				message: "Enter the quantity of product to add??"
			}
		])
		.then(function (answer) {
			if (isNaN(answer.price) || isNaN(answer.stock_quantity)) {
				console.log("Invalid Input");
				if (isNaN(answer.price)) console.log("Invalid Price");
				if (isNaN(answer.stock_quantity)) console.log("Invalid Quantity");
				displayMenu();
			} else {
				var newrow = {
					product_name: answer.product_name,
					department_name: answer.department_name,
					price: answer.price,
					stock_quantity: answer.stock_quantity
				};
				var sql = "insert into products set ?";
				connection.query(sql, newrow, function (err, res) {
					if (err) throw err;
					displayMenu();
				});
			}
		});
}

