USE company_DB;

-- INSERT INTO department(departmentName)
-- VALUES ("Field Marketing"),
-- ("Digital Marketing"),
-- ("Brand Marketing"),
-- ("Content Marketing")
-- ;

INSERT INTO role (title, salary, department_id)
VALUES ("Intern", 500, 3),
("Coordinator", 600, 2),
("Specialist", 800, 1),
("Manager", 300, 4),
("Associate Director", 900, 1),
("Digital Guru", 850, 2),
("Chief Marketing Officer", 600, 3),
("Ads Ninja", 400, 3),
("Creative Mastermind", 600, 4),
("Super Statician", 500, 3),
("The holy marketer", 1000000, 2)
;

-- INSERT INTO employee (first_name, last_name, role_id, manager_id)
-- VALUES ("Tom", "Hanks", 6, 7),
-- ("Taylor", "Swift", 5, 4),
-- -- ("Lindsey", "Lohan", 6, 3),
-- -- ("Thomas", "Jefferson", 2, 1),
-- -- ("John", "Legend", 3, 4),
-- -- ("George", "The Great", 4, 3),
-- -- ("Alexia", "Quarentina", 4, 3),
-- -- ("Hailey", "Whatsherface", 4, 1)
-- ;

-- select * FROM employee;
select * FROM role;
select * FROM department; 
