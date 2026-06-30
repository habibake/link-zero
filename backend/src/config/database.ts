import mysql from "mysql2/promise";

export const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", // Si tu MySQL tiene contraseña, escríbela aquí
    database: "link_zero_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});