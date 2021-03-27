var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Iwanttobelieve01',
  database: 'employeeTracker_DB',
});


connection.connect(function (err) {
  if (err) throw err;

  start();
});


function start() {
  inquirer
    .prompt({
      name: 'readOrWrite',
      type: 'list',
      message: 'What would you like to do? [View all employees] or [Add a new employee]?',
      choices: [
        'View all employees', 
        'Add new employee', 
        'View all roles',
        'Delete Employee',
        'Update employee`s manager',
        'Update employee`s role id',

      ],
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.readOrWrite === 'Add new employee') {
        addNewEmployee();
      } else if (answer.readOrWrite === 'View all employees') {
        viewAllEmployees();
      } else if (answer.readOrWrite === 'View all roles') {
        viewAllRoles();
      } else if (answer.readOrWrite === 'Delete Employee') {
        deleteEmployee();
      } else if (answer.readOrWrite === 'Update employee`s manager') {
        UpdateEmplpoyeeManager();
      } else if (answer.readOrWrite === 'Update employee`s role id') {
        UpdateEmployeeRole();
      } else {
        connection.end();
      }
    });
}


function addNewEmployee() {
  inquirer
    .prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'What is the employee`s first name?',
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'What is the employee`s last name?',
      },
      {
        name: 'roleId',
        type: 'input',
        message: 'What is the employee`s Role ID?',
      },
      {
        name: 'managerId',
        type: 'input',
        message: 'What is the employee`s Manager ID?',
      },
    ])
    .then(function (answer) {
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.roleId,
          role_id: answer.managerId,
        },
        function (err) {
          if (err) throw err;
          console.log('New Employee successfully created!');
          start();
        }
      );
    });
}

// function viewAllEmployees() {
//   connection.query('SELECT * FROM employee', function (err, results) {
//     if (err) throw err;
//     console.table(results);   
//     start();
//   });
// }


function viewAllEmployees() {
  connection.query("SELECT roleTable.role_id, roleTable.title, employee.employee_id, employee.first_name, employee.last_name, roleTable.salary, employee.manager_id FROM roleTable INNER JOIN employee ON roleTable.role_id=employee.role_id", function (err, results) {
    if (err) throw err;
    console.table(results);   
    start();
  });
}

function viewAllRoles() {
  connection.query('SELECT * FROM roleTable', function (err, results) {
    if (err) throw err;
    console.table(results);   
    start();
  });
}

function deleteEmployee() {
  connection.query("SELECT * FROM employee;", function (err, res) {
    inquirer
      .prompt([
        {
          type: "list",
          message: "What Employee would you like to delete ?",
          name: "removeEmployee",
          choices: res.map((obj) => ({
            name: `${obj.last_name}, ${obj.first_name}`,
            value: `${obj.employee_id}`,
          })),
        },
      ])
      .then(function (Data) {
        console.log(Data);
        connection.query(
          "DELETE FROM employee WHERE employee_id = ?",
          Data.removeEmployee,
          function (error) {
            if (error) throw error;
            console.log("Employee Deleted");
            
            start();
          }
        );
      });
  });
}

function UpdateEmplpoyeeManager() {
  connection.query("SELECT * FROM employee;", function (err, res) {
    inquirer
      .prompt([
        {
          type: "list",
          message: "Whose Employee´s Manager Would you like to Update ?",
          name: "UpdateEmployeeManager",
          choices: res.map((obj) => ({
            name: `${obj.last_name}, ${obj.first_name}, Manager's ID: ${obj.manager_id}`,
            value: `${obj.employee_id}`,
          })),
        },
        {
          type: "list",
          message: "What is The New Updated Manager`s Id?",
          name: "updatedManagerID",
          choices: [0, 1, 2, 3, 4],
        },
      ])
      .then(function (Data) {
        console.log(Data);
        connection.query(
          "UPDATE employee SET manager_id = ? WHERE employee_id = ?",
          [Data.UpdateEmployeeManager, Data.updatedManagerID],
          function (error) {
            if (error) throw error;
            console.log("Updated Employee`s Manager`s Id");
           
            start();
          }
        );
      });
  });
}

function UpdateEmployeeRole() {
  connection.query("SELECT * FROM employee;", function (err, res) {
    inquirer
      .prompt([
        {
          type: "list",
          message: "What Employee`s Role Would you like to Update?",
          name: "UpdateEmployeeRole",
          choices: res.map((obj) => ({
            name: `${obj.last_name}, ${obj.first_name}`,
            value: `${obj.employee_id}`,
          })),
        },

        {
          type: "list",
          message: "What is The New Role Id?",
          name: "UpdatedRoleID",
          choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        },
      ])
      .then(function (Data) {
        console.log(Data);
        connection.query(
          "UPDATE employee SET role_id = ? WHERE employee_id = ?",
          [Data.UpdatedRoleID, Data.UpdateEmployeeRole],
          function (error) {
            if (error) throw error;
            console.log("Employee`s Role Updated!!!");
            start();
          }
        );
      });
  });
}
