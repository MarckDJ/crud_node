const mysql = require("mysql");

const mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "[usuario]",
    password: "[password]",
    database: "juguito",
});

mysqlConnection.connect((err) => {
    if (err) {
        console.log("conexion fallida");
    } else {
        console.log("conexion exitosa");
    }
});

module.exports = mysqlConnection;
