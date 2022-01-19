// app.js executes express using node.js

const express = require('express');
const app = express();
const sqlite3 = require('sqlite3'); // import
const path = require('path');

const dbPath = 'app/db/database.sqlite3';

app.use(express.static(path.join(__dirname, 'public'))); // set "public" directory as a static root directory

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

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listen on port: ' + port);
