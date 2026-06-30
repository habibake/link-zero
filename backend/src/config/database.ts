import mysql from "mysql2/promise";

export const db = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "", // Si tu MySQL tiene contraseña, escríbela aquí
    database: "link_zero_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});