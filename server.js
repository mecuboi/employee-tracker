const inquirer = require('inquirer')
const mysql = require('mysql2');
const cTable = require('console.table');
const mainQuestions = [
    {
        type: 'list',
        name: 'choices',
        message: 'What would you like to do?',
        choices: ['View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Update an employee manager',
            'View employees by manager',
            'View employees by department',
            'Delete a department',
            'Delete a role',
            'Delete an employee',
            'View total budget of a department'
        ]
    }]

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password123',
        database: 'company_db'
    }
);

db.connect(err => {
    if (err) throw err;
    console.log('Connection succesfull\n\n');
    welcomeScreen();
});

const welcomeScreen = () => {
    console.log('* * * * * * * * * * * * * * * *')
    console.log('*           WELCOME           *')
    console.log('*            HUMAN            *')
    console.log('* * * * * * * * * * * * * * * *\n\n')
    promptQuestion();
}

const promptQuestion = () => {
    inquirer
        .prompt(mainQuestions)
        .then((data) => {
            let answer = data.choices;

            if (answer === 'View all departments') {
                view('department')
            }

            if (answer === "View all roles") {
                view('role');
            }

            if (answer === "View all employees") {
                view('employee');
            }

            if (answer === "Add a department") {
                addDepartment();
            }

            if (answer === "Add a role") {
                addRole();
            }

            if (answer === "Add an employee") {
                addEmployee();
            }

            if (answer === "Update an employee role") {
                updateEmployeeRole();
            }

            if (answer === "Update an employee manager") {
                updateManager();
            }

            if (answer === "View employees by manager") {
                viewEmployeesByManager();
            }

            if (answer === "View employees by department") {
                viewEmployeeByDepartment();
            }

            if (answer === "Delete a department") {
                deleteDepartment();
            }

            if (answer === "Delete a role") {
                deleteRole();
            }

            if (answer === "Delete an employee") {
                deleteEmployee();
            }

            if (answer === "View total budget of a department") {
                viewBudget();
            }

        })
        .catch(err => {
            console.error(err);
        })
};

const view = (data) => {
    console.log('\nList of departments: \n')
    let sql = `SELECT * FROM ${data}`

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        promptQuestion();
    })

}

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newDept',
                message: 'What is the name of the new department?',
                validate: newDept => {
                    if (newDept) {
                        return true;
                    } else {
                        console.log('Please enter a department');
                        return false;
                    }
                }
            }])
        .then((data) => {
            let newDepartment = data.newDept;
            let sql = `INSERT INTO department (name) VALUES ('${newDepartment}')`
            db.query(sql, (err, result) => {
                if (err) throw err;
                console.log(`
________________________________________________________________

${newDepartment} have been succesfully added as a new department
________________________________________________________________
                
                `)
                promptQuestion();
            })
        })
        .catch(err => {
            console.error(err);
        })
}

const addRole = () => {
    let departmentList = [];
    db.query('SELECT * FROM department', (err, result) => {
        if (err) throw err;
        result.forEach(dept => {
            departmentList.push({ name: dept.name, value: dept.id })
        })
    })
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'newRole',
                message: 'What is the name of the new role?',
                validate: newRole => {
                    if (newRole) {
                        return true;
                    } else {
                        console.log('Please enter a role');
                        return false;
                    }
                }
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the annual salary of the new role?',
                validate: salary => {
                    if ((salary)) {
                        return true;
                    } else {
                        console.log('Please enter a salary figure');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department does this role belong to?',
                choices: departmentList
            }
        ])
        .then((data) => {
            let params = [data.newRole, data.salary, data.department];
            let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`

            db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log(`
________________________________________________________________

${data.newRole} have been succesfully added 
________________________________________________________________
                
                `)
                promptQuestion();
            })
        })
        .catch(err => {
            console.error(err);
        })
}

const addEmployee = () => {
    let roleList = [];
    let managerList = [{ name: 'Employee is a new manager', value: 0 }];

    db.query('SELECT * FROM role', (err, result) => {
        if (err) throw err;
        result.forEach(role => {
            roleList.push({ name: role.title, value: role.id })
        })
    })

    db.query('SELECT * FROM employee', (err, result) => {
        if (err) throw err;
        result.forEach(employee => {
            managerList.push({ name: employee.first_name + ' ' + employee.last_name, value: employee.id })
        })
    })

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first',
                message: `New employee's first name?`,
                validate: name => {
                    if (name) {
                        return true;
                    } else {
                        console.log('Please enter the first name');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'last',
                message: `New employee's last name?`,
                validate: name => {
                    if (name) {
                        return true;
                    } else {
                        console.log('Please enter the last name');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the role?',
                choices: roleList

            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who will be the manager?',
                choices: managerList
            }
        ])
        .then((data) => {
            var params = []
            if (data.manager === 0) {
                params = [data.first, data.last, data.role, null]
            } else {
                params = [data.first, data.last, data.role, data.manager]
            }
            let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`

            db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log(`
________________________________________________________________

${data.first} ${data.last} have been succesfully added 
________________________________________________________________
                
                `)
                promptQuestion();
            })
        })
        .catch(err => {
            console.error(err);
        })
}

const updateEmployeeRole = () => {
    let employeeList = [];
    let roleList = [];

    db.query('SELECT * FROM employee', (err, result) => {
        if (err) throw err;
        result.forEach(employee => {
            employeeList.push({ name: employee.first_name + ' ' + employee.last_name, value: employee.id })
        })
    })

    db.query('SELECT * FROM role', (err, result) => {
        if (err) throw err;
        result.forEach(role => {
            roleList.push({ name: role.title, value: role.id })
        })
    })
    
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'errorfix',
                message: `Press enter to continue`,
            },
            {
                type: 'list',
                name: 'employee',
                message: `Which employee would you like to update the role?`,
                choices: employeeList
            },
            {
                type: 'list',
                name: 'role',
                message: `What would be the new role?`,
                choices: roleList
            }
        ])
        .then((data) => {
            let params = [data.role, data.employee]
            let sql = `UPDATE employee SET role_id = ? WHERE id = ?`

            db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log(`
________________________________________________________________

The role have been succesfully updated
________________________________________________________________
                
                `)
                promptQuestion();
            })
        })
        .catch(err => {
            console.error(err);
        })
}

const updateManager = () => {
    let employeeList = [];

    db.query('SELECT * FROM employee', (err, result) => {
        if (err) throw err;
        result.forEach(employee => {
            employeeList.push({ name: employee.first_name + ' ' + employee.last_name, value: employee.id })
        })
    })
    
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'errorfix',
                message: `Press enter to continue`,
            },
            {
                type: 'list',
                name: 'employee',
                message: `Which employee would you like to switch manager?`,
                choices: employeeList
            },
            {
                type: 'list',
                name: 'manager',
                message: `Who is the new manager?`,
                choices: employeeList
            }
        ])
        .then((data) => {
            var params = [data.manager, data.employee]
            if (data.employee === data.manager) {
                params = [null, data.employee]
            }
            let sql = `UPDATE employee SET manager_id = ? WHERE id = ?`

            db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log(`
________________________________________________________________

The employee's manager have been succesfully updated
________________________________________________________________
                
                `)
                promptQuestion();
            })
        })
        .catch(err => {
            console.error(err);
        })
}