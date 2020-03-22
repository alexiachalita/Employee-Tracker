// Add Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

const ALL_EMPLOYEES = "View All Employees";
const ADD_EMPLOYEE = "Add Employee";
const ALL_DEPARTMENTS = "View All Departments";
const ALL_ROLES = "View All Roles";
const ADD_DEPARTMENT = "Add New Department";
const ADD_ROLE = "Add New Role";
const UPDATE_ROLE = "Update Role";

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

function viewalldepartments() {
    connection.query(
        "select department.departmentName from department order by department.id",
        function (error, results) {
            if (error) throw error;
            console.table(results);
        });
}


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

function getallroles() {
    return new Promise((resolve, reject)=>
    connection.query (
        "select * from role order by role.id",
        function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        }
    )
    );
}

function getallDepartments() {
    return new Promise((resolve, reject)=>
    connection.query (
        "select * from department order by department.id",
        function (error, results) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        }
    )
    );
}

async function addDepartment() {
    try {
        const answer = await inquirer.prompt([
            {
                name: "What is the new Department Name?",
                type: "input"
            }
        ]);
        const newDepartment = answer["What is the new Department Name?"];
        connection.query(
            `INSERT INTO department (departmentName) VALUE ("${newDepartment}")`,
            function (error, results) {
                if (error) throw error;
                console.table(results);
            });
    } catch (err) {
        console.log(err);
    }
}

async function addemployee() {
    console.log("Adding new Employee:");
    try {
        const roles = await getallroles();
        const rolesText = roles.map( role => role.title);
        const questions = [
            {
                name: "What is the first name?",
                type: "input"
            },
            {
                name: "What is the last name?",
                type: "input"
            },
            {
                name: "What is the employee's role?",
                type: "list",
                choices: rolesText,
                name: "role"
            }
        ];
        const answers = await inquirer.prompt(questions);
        const firstName = answers["What is the first name?"];
        const lastName = answers["What is the last name?"];
        const roleTitle = answers["role"];
        let roleID=-1;
        roles.forEach(role => {
            if (role.title === roleTitle) {
                roleID = role.id;
            }
        });
        console.log(firstName, lastName, roleID);
        connection.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE ("${firstName}", "${lastName}", ${roleID}, 2)`,
            function (error, results) {
                if (error) throw error;
                console.table(results);
            });
    } catch(err) {
        console.log(err);
    }

}

async function addRole() {
    console.log("Adding new Role:");
    try {
        const departments = await getallDepartments();
        const departmentTitles = departments.map( dpt => dpt.departmentName);
        const questions = [
            {
                name: "What is the new role?",
                type: "input"
            },
            {
                name: "What is the salary?",
                type: "input"
            },
            {
                name: "What department does the new role belong to?",
                type: "list",
                choices: departmentTitles,
                name: "department"
            }
        ];
        const answers = await inquirer.prompt(questions);
        const roleName = answers["What is the new role?"];
        const salary = answers["What is the salary?"];
        const departmentTitle = answers["department"];
        let departmentID=-1;
        departments.forEach(dpt => {
            if (dpt.departmentName === departmentTitle) {
                departmentID = dpt.id;
            }
        });
        console.log(roleName, salary, departmentID);
        connection.query(
            `INSERT INTO role (title, salary, department_id) VALUE ("${roleName}", ${salary}, ${departmentID})`,
            function (error, results) {
                if (error) throw error;
                console.table(results);
            });
    } catch(err) {
        console.log(err);
    }

}

async function updateRole() {
    try {
    roles = await getallroles();
    const depts = await getallDepartments();
    const departmentTitles = depts.map( dpt => dpt.departmentName);
    const roleTitles = roles.map(role => role.title);
    const answer = await inquirer.prompt([{
        message: "Which role would you like to update?",
        type: 'list',
        choices: roleTitles,
        name: 'roleSelection'
    }])
    let roleID=-1;
    let departmentID = -1;
    let salary = -1;
    roles.forEach(role => {
        if (role.title === answer.roleSelection) {
            roleID = role.id;
            departmentID = role.department_id;
            salary = role.salary;
        }
    });
    const currentDepartment = depts.find( dept => dept.id === departmentID).departmentName;
    const answers = await inquirer.prompt([
        {
            message: "Current role title:",
            type: 'input',
            name: 'roleTitle',
            default: answer.roleSelection
        },
        {
            message: "Current salary:",
            type: "input",
            name: "salary",
            default: salary
        },
        {
            message: "Current Department:",
            type: "list",
            choices: departmentTitles,
            default: currentDepartment,
            name: "department"
        }
    ]);
    depts.forEach(dept => {
        if (dept.departmentName === answers.department) {
            departmentID = dept.id
        }
    });
    connection.query(
        `UPDATE role SET role.title = "${answers.roleTitle}", role.salary = ${answers.salary}, role.department_id = ${departmentID} WHERE role.id = ${roleID}`,
        function (error, results) {
            if (error) throw error;
            console.table(results);
        });
    } catch (err) {
        console.log(err);
    }
}

// Copy and paste your work, or start typing.
async function choiceSelection({
    choice
}) {
    switch (choice) {
        case ALL_EMPLOYEES:
            //TODO LIST all Employees in the Database
            //employees = connection.query('SELECT * FROM Employee');
            await viewallemployees();
            renderMenu();
            break;
        case ADD_EMPLOYEE:
            await addemployee();
            renderMenu()
            break;
        case ALL_ROLES:
            await viewallroles();
            renderMenu()
            break;
        case ADD_DEPARTMENT:
            await addDepartment();
            renderMenu()
            break;
        case ALL_DEPARTMENTS:
            await viewalldepartments();
            renderMenu()
            break;
        case ADD_ROLE:
            await addRole();
            renderMenu()
            break;
        case UPDATE_ROLE:
            await updateRole();
            renderMenu();
            break;
        default:
            renderMenu();
    }
}
function renderMenu() {
    setTimeout(displayMenu, 500);
}

function displayMenu() {
    inquirer.prompt([{
        message: "What would you like to do?",
        type: "list",
        name: "choice",
        choices: [ALL_EMPLOYEES,  ALL_DEPARTMENTS, ALL_ROLES, ADD_EMPLOYEE, ADD_DEPARTMENT, ADD_ROLE, UPDATE_ROLE]
    }]).then(choice => {
        choiceSelection(choice);
        { choice: "View All Employees" }
    });
}


//Create array of strings list 

renderMenu();
