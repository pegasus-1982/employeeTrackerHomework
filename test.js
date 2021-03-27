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



console.log(
  logo({
    name: "Employee Tracker APP",
    font: "Speed",
    lineChars: 10,
    padding: 2,
    margin: 3,
    borderColor: "yellow",
    logoColor: "bold-red",
    textColor: "white",
  })
    .emptyLine()
    .right("version 4.0.1234")
    .emptyLine()
    .center(longText)
    .render()
);

function employeeTrackerStartQuestionsFunction() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do ?",
        name: "trackerStartQuestion",
        choices: [
          "View All Emloyee`s",
          "View All Emloyee`s Roles",
          "Add Epmloyee To DataBase",
          "Update Employee`s Role ID",
          "Update Emplpoyee`s Manager ID",
          "Remove Emplpoyee From DataBase",
          "Remove Emplpoyee`s Role",
          "Exit",
        ],
      },
    ])
    .then((response) => {
      switch (response.trackerStartQuestion) {
        case "View All Emloyee`s":
          ViewAllEpmloyeeFunction();
          break;
        case "View All Emloyee`s Roles":
          ViewAllRolesFunction();
          break;
        case "Add Epmloyee To DataBase":
          AddEpmloyeeFunction();
          break;
        case "Update Employee`s Role ID":
          UpdateEmployeeRoleFunction();
          break;
        case "Update Emplpoyee`s Manager ID":
          UpdateEmplpoyeeManagerFunction();
          break;
        case "Remove Emplpoyee From DataBase":
          RemoveEpployeeFunction();
          break;
        case "Remove Emplpoyee`s Role":
          RemoveRoleFunction();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

function ViewAllEpmloyeeFunction() {
  connection.query(
    "SELECT id, first_name, last_name, role_id FROM employee",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      employeeTrackerStartQuestionsFunction();
    }
  );
}

function ViewAllRolesFunction() {
  connection.query(
    "SELECT * FROM employee INNER JOIN roles ON employee.role_id = roles.id",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      employeeTrackerStartQuestionsFunction();
    }
  );
}

function AddEpmloyeeFunction() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the New Employee`s ID Number?",
        name: "NewEmployeeIdInput",
      },
      {
        type: "input",
        message: "What is the New Employee`s First Name?",
        name: "NewEmployeeFirstName",
      },
      {
        type: "input",
        message: "What is the New Employee`s Last Name?",
        name: "NewEmployeeLastName",
      },
      {
        type: "list",
        message: "What is the New Employee`s Role Id?",
        name: "NewEmployeeRoleId",
        choices: ["88", "14", "5", "10"],
      },
      {
        type: "list",
        message: "What is the Manager Id`s of the New Employee?",
        name: "NewEmployeeManagerId",
        choices: ["1", "14"],
      },
    ])
    .then(function (Data) {
      console.log(Data);
      connection.query(
        "INSERT INTO employee SET ?",
        {
          id: Data.NewEmployeeIdInput,
          first_name: Data.NewEmployeeFirstName,
          last_name: Data.NewEmployeeLastName,
          role_id: Data.NewEmployeeRoleId,
          manager_id: Data.NewEmployeeManagerId,
        },
        function (error) {
          if (error) throw error;
          console.log("Added New Employee To Database");
          ViewAllRolesFunction();
          employeeTrackerStartQuestionsFunction();
        }
      );
    });
}

function UpdateEmployeeRoleFunction() {
  connection.query("SELECT * FROM employee;", function (err, res) {
    inquirer
      .prompt([
        {
          type: "list",
          message: "What Employee`s Role Would you like to Update?",
          name: "UpdateEmployeeRole",
          choices: res.map((obj) => ({
            name: `${obj.last_name}, ${obj.first_name}`,
            value: `${obj.id}`,
          })),
        },

        {
          type: "list",
          message: "What is The New Role Id?",
          name: "UpdatedRoleID",
          choices: [88, 24, 14, 10, 5],
        },
      ])
      .then(function (Data) {
        console.log(Data);
        connection.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [Data.UpdatedRoleID, Data.UpdateEmployeeRole],
          function (error) {
            if (error) throw error;
            console.log("Employee`s Role Has Been Updated");
            ViewAllRolesFunction();
            employeeTrackerStartQuestionsFunction();
          }
        );
      });
  });
}

function UpdateEmplpoyeeManagerFunction() {
  connection.query("SELECT * FROM employee;", function (err, res) {
    inquirer
      .prompt([
        {
          type: "list",
          message: "What Employee Manager Would you like to Update ?",
          name: "UpdateEmployeeManager",
          choices: res.map((obj) => ({
            name: `${obj.last_name}, ${obj.first_name}, Manager's ID: ${obj.manager_id}`,
            value: `${obj.id}`,
          })),
        },
        {
          type: "list",
          message: "What is The New Updated Manager`s Id?",
          name: "NewManagerID",
          choices: [1, 2, "Null"],
        },
      ])
      .then(function (Data) {
        console.log(Data);
        connection.query(
          "UPDATE employee SET manager_id = ? WHERE id = ?",
          [Data.UpdateEmployeeManager, Data.NewManagerID],
          function (error) {
            if (error) throw error;
            console.log("Updated Employee`s Manager`s Id");
            ViewAllRolesFunction();
            employeeTrackerStartQuestionsFunction();
          }
        );
      });
  });
}

function RemoveEpployeeFunction() {
  connection.query("SELECT * FROM employee;", function (err, res) {
    inquirer
      .prompt([
        {
          type: "list",
          message: "What Employee would you like to Remove ?",
          name: "removeEmployee",
          choices: res.map((obj) => ({
            name: `${obj.last_name}, ${obj.first_name}`,
            value: `${obj.id}`,
          })),
        },
      ])
      .then(function (Data) {
        console.log(Data);
        connection.query(
          "DELETE FROM employee WHERE id = ?",
          Data.removeEmployee,
          function (error) {
            if (error) throw error;
            console.log("Removed Employee From Database");
            ViewAllRolesFunction();
            employeeTrackerStartQuestionsFunction();
          }
        );
      });
  });
}

function RemoveRoleFunction() {
  connection.query("SELECT * FROM employee;", function (err, res) {
    inquirer
      .prompt([
        {
          type: "list",
          message: "What Employee`s Role would you like to Remove ?",
          name: "removeEmployeeRole",
          choices: res.map((obj) => ({
            name: `${obj.last_name}, ${obj.first_name}, ${obj.role_id}`,
            value: `${obj.id}`,
          })),
        },
      ])
      .then(function (Data) {
        console.log(Data);
        connection.query(
          "UPDATE employee SET role_id = NULL WHERE id = ? ",
          [Data.removeEmployeeRole],
          function (error) {
            if (error) throw error;
            console.log("Removed Employee Role From Database");
            ViewAllEpmloyeeFunction();
            employeeTrackerStartQuestionsFunction();
          }
        );
      });
  });
}