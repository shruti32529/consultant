const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || "bcde",
    process.env.MYSQL_USER || "root",
    process.env.MYSQL_PASSWORD || "",
    {
        host: process.env.MYSQL_HOST || "localhost",
        port: Number(process.env.MYSQL_PORT) || 3306,
        dialect: "mysql",
        logging: false
    }
);

module.exports = sequelize;
