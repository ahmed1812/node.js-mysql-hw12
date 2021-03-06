// Required Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
// var table = require('console.table');
var Table = require('cli-table');
// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "rootroot",
    database: "bamazon_db"
});

// If connection doesn't work, throws error, else...
connection.connect(function (err) {
    if (err) throw err;
    //Call main function
    makeTable();
});
// BEGIN Display Inventory
var makeTable = function () {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        // Cli-Table display code 
        var theDisplayTable = new Table({
            head: ['Item ID', 'Product Name', 'Category', 'Price', 'Quantity'],
            colWidths: [10, 25, 25, 10, 14]
        });
        // Set/Style table headings and Loop through entire inventory
        for (var i = 0; i < res.length; i++) {

            theDisplayTable.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        // END Display Inventory
        console.log(theDisplayTable.toString());


        custamerchoice(res)
    })

}
function custamerchoice(res) {
    // Prompt Customers Input
    inquirer.prompt([
        {
            name: "choice",
            type: "input",
            message: "What is the product you would like to buy? [quit with Q]"
            // Ordering function
        }]).then(function (answer) {

            var correct = false;
            if (answer.choice.toUpperCase() == "Q") {
                process.exit();
            }
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name == answer.choice) {
                    correct = true;
                    var product = answer.choice;
                    var id = i;
                    inquirer.prompt({
                        name: "quant",
                        type: "input",
                        message: "How many units of the product they would like to buy?",
                        validate: function (value) {
                            if (isNaN(value) == false) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }).then(function (answer) {
                        // Varify item quantity desired is in inventory
                        if ((res[id].stock_quantity - answer.quant) > 0) {
                            connection.query("UPDATE products SET stock_quantity='"
                                + (res[id].stock_quantity - answer.quant)
                                + "'WHERE product_name='" + product
                                + "'", function (err, res2) {
                                    console.log("product");
                                    makeTable();
                                })

                        } else {
                            console.log(" not product");
                            custamerchoice(res);
                        }

                    })
                }
            }
            if (i == res.length && correct == false) {
                console.log("not valid")
                custamerchoice(res);
            }
        })
}