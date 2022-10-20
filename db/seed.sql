INSERT INTO department (name)
VALUES 
('underwriting'),
('claims'),
('operations'),
('finance');

INSERT INTO role (title, salary, department_id)
VALUES
('underwriting manager', 200000, 1),
('senior underwriter', 150000, 1),
('underwriter', 100000, 1),
('claims manager', 180000, 2),
('senior claims', 130000, 2),
('claims consultant', 90000, 2),
('operation manager', 140000, 3),
('operation officer', 75000, 3),
('finance manager', 130000, 4),
('accountant', 95000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Tom', 'Holland', 1,  NULL),
('Chris', 'Hemsworth', 4, NULL),
('Steve', 'Roger', 7, NULL),
('Tony', 'Stark', 9, NULL),
('Phil', 'Coulson', 2, 1),
('James', 'Bond', 3, 1),
('Daniel', 'Craig', 3, 1),
('Thor', 'Odin', 5, 2),
('Mister', 'Bean', 6, 2),
('Peter', 'Parker', 8, 7),
('Ash', 'Ketchum', 10, 9),
('Natasha', 'Ramanov', 10, 9);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
