// Add Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

const ALL_EMPLOYEES = "View All Employees";
const ADD_EMPLOYEE = "Add Employee";
const ALL_DEPARTMENTS = "View All Departments";
const ALL_ROLES = "View All Roles";

// Create DB Connections
var connection = mysql.createConnection({
    host: "localhost",

    //PORT 
    port: 3306,

    //Username
    user: "root",

    //Password
    password: "root",
    database: "company_DB",
});

//If Connection Fails
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadId + "\n");
    //maybe call another function here
});

function viewallemployees() {
    connection.query(
        "select employee.id, employee.first_name, employee.last_name, role.title, department.departmentName from employee left join role on employee.role_id=role.id left join department on role.department_id=department.id",
        function (error, results) {
            if (error) throw error;
            console.table(results);

        });
}

function viewallroles() {
    connection.query(
        "select role.id, role.title, department.departmentName from role left join department on role.department_id=department.id order by role.id",
        function (error, results) {
            if (error) throw error;
            console.table(results);
        });
}

//ADD VIEW DEPARTMENT


// Copy and paste your work, or start typing.
async function choiceSelection({
    choice
}) {
    switch (choice) {
        case ALL_EMPLOYEES:
            //TODO LIST all Employees in the Database
            //employees = connection.query('SELECT * FROM Employee');
            await viewallemployees();
            break;
          
        case ALL_ROLES:
           await viewallroles();
           break;
            
        default:
            renderMenu();

        // ADD DEPARTMENT!    
    }
}


function renderMenu() {
    inquirer.prompt([{
        message: "What do you want on your pizza?",
        type: "list",
        name: "choice",
        choices: [ALL_EMPLOYEES, ADD_EMPLOYEE, ALL_DEPARTMENTS, ALL_ROLES]
    }]).then(choice => {
        choiceSelection(choice);
        // { choice: "View All Employees" }
    });
}


//Create array of strings list 

renderMenu();