// Get the client
const mysql = require('mysql2');

// Create the connection to database
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Bookshop',
    dateStrings: true,
    multipleStatements: true
});


module.exports = conn;