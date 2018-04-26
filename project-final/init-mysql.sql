USE mysql;
SET SQL_SAFE_UPDATES = 0;
ALTER USER 'adminmysql' IDENTIFIED BY 'adminmysql';
UPDATE USER SET plugin='mysql_native_password' WHERE User='adminmysql';
DROP DATABASE IF EXISTS default_db;
CREATE DATABASE default_db;
USE default_db;
DROP TABLE IF EXISTS highscores;
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    id              INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uname           VARCHAR(16)         UNIQUE,
    pwdsalt         CHAR(64)            NOT NULL,
    pwdhash         CHAR(64)            NOT NULL
);
CREATE TABLE highscores (
    id              INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    recordAccount   INTEGER UNSIGNED REFERENCES accounts(id) ON DELETE CASCADE,
    score           INTEGER             CHECK (score >= 0)
);