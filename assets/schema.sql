DROP database if exists company_DB;

CREATE DATABASE company_DB;

USE company_DB;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  departmentName VARCHAR(30) NULL,
  primary key(id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL,
  department_id INT,
  primary key(id),
  foreign key(department_id) references department(id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id int,
  manager_id int,
  primary key(id),
  foreign key(role_id) references role(id)
);
