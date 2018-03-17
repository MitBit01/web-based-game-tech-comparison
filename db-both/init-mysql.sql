DROP DATABASE IF EXISTS default_db;
CREATE DATABASE default_db;
USE default_db;
DROP TABLE IF EXISTS allianceMembers;
DROP TABLE IF EXISTS alliances;
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
CREATE TABLE alliances (
    id              INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    allianceOwner   INTEGER UNSIGNED REFERENCES accounts(id) ON DELETE CASCADE,
    name            VARCHAR(20)         UNIQUE,
    score           INTEGER DEFAULT 0   CHECK (score >= 0) 
);
CREATE TABLE allianceMembers (
    id              INTEGER UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    alliance        INTEGER UNSIGNED REFERENCES alliances(id) ON DELETE CASCADE,
    member          INTEGER UNSIGNED REFERENCES accounts(id) ON DELETE CASCADE,
    chainRank       INTEGER             CHECK (chainRank >= 1),
    UNIQUE(alliance, member, chainRank)
);