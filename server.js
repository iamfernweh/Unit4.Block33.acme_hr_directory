const pg = require('pg');
const express = require('express');
const app = express();
const morgan = require('morgan');

const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/acme_hr_directory'
);

app.use(express.json());
app.use(morgan('dev'));

app.get('/api/employees', async (req, res, next) => {
  try {
    const SQL = `
    SELECT *
    FROM employees;
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (er) {
    next(er);
  }
});

app.get('/api/departments', async (req, res, next) => {
  try {
    const SQL = `
    SELECT *
    FROM departments;
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (er) {
    next(er);
  }
});

app.post('/api/employees', async (req, res, next) => {
  try {
    const SQL = `
    INSERT INTO employees(txt, department_id)
    VALUES($1, $2)
    RETURNING *
    `;
    const response = await client.query(SQL, [
      req.body.txt,
      req.body.department_id,
    ]);
    res.send(201).send(response.rows[0]);
  } catch (er) {
    next(er);
  }
});

app.delete('/api/employees/:id', async (req, res, next) => {
  try {
    const SQL = `
    DELETE FROM employees
    WHERE id = $1;
    `;
    await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (er) {
    next(er);
  }
});

app.put('/api/employees/:id', async (req, res, next) => {
  try {
    const SQL = `
    UPDATE employees
    SET txt = $1,
    ranking = $2,
    updated_at: now(),
    department_id = $3,
    WHERE id = $4
    RETURNING *
    `;
    const response = await client.query(SQL, [
      req.body.txt,
      req.body.ranking,
      req.body.department_id,
      req.params.id,
    ]);
    res.send(response.rows[0]);
  } catch (er) {
    next(er);
  }
});

//error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message || err });
});

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
    CREATE TABLE employees(
        id SERIAL PRIMARY KEY,
        txt VARCHAR (100) NOT NULL,
        ranking INTEGER NOT NULL DEFAULT 5,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        department_id INTEGER REFERENCES employees(id) NOT NULL
    );
  `;
  await client.query(SQL);
  console.log('tables created');
  SQL = `
        INSERT INTO departments(name) VALUES ('engineering');
        INSERT INTO departments(name) VALUES ('product');
        INSERT INTO departments(name) VALUES ('sales');
        INSERT INTO (txt, department_id) VALUES ('Vans 1', (SELECT id FROM departments WHERE name='engineering'));
        INSERT INTO (txt, department_id) VALUES ('Bob  2', (SELECT id FROM departments WHERE name='product'));
        INSERT INTO (txt, department_id) VALUES ('Thomas 3', (SELECT id FROM departments WHERE name='sales'));
  `;
  console.log('data seeded');
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.log(`curl localhost:${port}/api/employees`);
    console.log(`curl localhost:${port}/api/departments`);
    console.log(`curl -X DELETE localhost:${port}/api/employees/1`);
    console.log(
      `curl -X POST localhost:${port}/api/employees -d '{"txt": "another foo", "department_id": 1}' -H "Content-Type:application/json"`
    );
  });
};

init();
