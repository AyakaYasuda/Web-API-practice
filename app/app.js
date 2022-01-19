// app.js executes express using node.js

const express = require('express');
const app = express();
const sqlite3 = require('sqlite3'); // import
const path = require('path');
const bodyParser = require('body-parser');

const dbPath = 'app/db/database.sqlite3';

// Parse the body of requests for the use of express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set "public" directory as a static root directory
app.use(express.static(path.join(__dirname, 'public')));

// API to get all users
app.get('/api/v1/users', (req, res) => {
  // Connect to database
  const db = new sqlite3.Database(dbPath);

  db.all('SELECT * FROM users', (err, rows) => {
    res.json(rows);
  });

  db.close();
});

// API to get a user
app.get('/api/v1/users/:id', (req, res) => {
  // Connect to database
  const db = new sqlite3.Database(dbPath);
  const id = req.params.id;

  db.get(`SELECT * FROM users WHERE id = ${id}`, (err, row) => {
    res.json(row);
  });

  db.close();
});

// API to search users matching with a keyword
app.get('/api/v1/search', (req, res) => {
  // Connect to database
  const db = new sqlite3.Database(dbPath);
  const keyword = req.query.q;

  db.all(`SELECT * FROM users WHERE name LIKE "%${keyword}%"`, (err, rows) => {
    res.json(rows);
  });

  db.close();
});

/*
==================================================================================
*/
// RUN function
const run = async (sql, db, res, message) => {
  return new Promise((resolve, reject) => {
    db.run(sql, err => {
      if (err) {
        res.status(500).send(err);
        return reject();
      } else {
        res.json({ message: message });
        return resolve();
      }
    });
  });
};
/*
==================================================================================
*/

// API to create a new user
app.post('/api/v1/users', async (req, res) => {
  // Connect to database
  const db = new sqlite3.Database(dbPath);

  const name = req.body.name;
  const profile = req.body.profile ? req.body.profile : '';
  const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : '';

  await run(
    `INSERT INTO users (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}" )`,
    db,
    res,
    'Successfully created a new user'
  );
  db.close();
});

// API to update a user
app.put('/api/v1/users/:id', async (req, res) => {
  // Connect to database
  const db = new sqlite3.Database(dbPath);
  const id = req.params.id;

  // get current user data to make sure the update is needed
  db.get(`SELECT * FROM users WHERE id=${id}`, async (err, row) => {
    const name = req.body.name ? req.body.name : row.name;
    const profile = req.body.profile ? req.body.profile : row.profile;
    const dateOfBirth = req.body.date_of_birth
      ? req.body.date_of_birth
      : row.date_of_birth;

    await run(
      `UPDATE users SET name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`,
      db,
      res,
      "Successfully updated a user's data"
    );
  });

  db.close();
});

// API to delete a user
app.delete('/api/v1/users/:id', async (req, res) => {
  // Connect to database
  const db = new sqlite3.Database(dbPath);
  const id = req.params.id;

  await run(
    `DELETE FROM users WHERE id=${id}`,
    db,
    res,
    "Successfully deleted a user's data"
  );

  db.close();
});

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listen on port: ' + port);
