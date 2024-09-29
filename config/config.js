// config/config.js
require("dotenv").config();

module.exports = {
  development: {
    username: process.env.LOCAL_DB_USERNAME || "root",
    password: process.env.LOCAL_DB_PASSWORD || "new_password",
    database: process.env.LOCAL_DB_NAME || "immo",
    host: process.env.LOCAL_DB_HOST || "127.0.0.1",
    port: process.env.LOCAL_DB_PORT || 3306,
    dialect: "mysql",
  },
  production: {
    username: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    host: process.env.MYSQL_ADDON_HOST,
    port: process.env.MYSQL_ADDON_PORT || 3306,
    dialect: "mysql",
  },
};
