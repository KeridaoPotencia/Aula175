// Conexão com o Banco de Dados

const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    database: 'telemedicina',
    password: 'Antenna20@@23'
});

module.exports = connection