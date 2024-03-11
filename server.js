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
  `;
  await client.query(SQL);
  console.log('data seeded');
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

init();
