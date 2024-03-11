const pg = require('pg');
const express = require('express');
const app = express();
const morgan = require('morgan');

const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/acme_hr_directory'
);

const init = async () => {
  console.log('connecting to db');
};

init();
