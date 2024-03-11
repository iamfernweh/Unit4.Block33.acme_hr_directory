const pg = require('pg');
const express = require('express');
const app = express();
const morgan = require('morgan');

const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/acme_hr_directory'
);

const init = async () => {
  console.log('connecting to db');
  await client.connect();
  console.log('connected to db');
  let SQL = `
    DROP TABLE IF EXISTS employees;
    DROP TABLE IF EXISTS departments;
    CREATE TABLE departments(
        id SERIAL PRIMARY KEY,
        txt VARCHAR(100) NOT NULL
    );
    CREATE TABLE employees (
        id SERIAL PRIMARY KEY,
        txt VARCHAR (100) NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        department_id INTEGER REFERENCES employees(id) NOT NULL
    );
  `;
  await client.query(SQL);
  console.log('tables created');
  SQL = `
        INSERT INTO 
  `;
  console.log('data seeded');
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

init();
