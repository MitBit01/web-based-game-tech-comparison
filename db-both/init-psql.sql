DROP TABLE IF EXISTS allianceMembers;
DROP TABLE IF EXISTS alliances;
DROP TABLE IF EXISTS highscores;
DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    id              SERIAL PRIMARY KEY,
    uname           VARCHAR(16)         UNIQUE,
    pwdsalt         CHAR(64)            NOT NULL,
    pwdhash         CHAR(64)            NOT NULL
);
CREATE TABLE highscores (
    id              SERIAL PRIMARY KEY,
    recordAccount   INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    score           INTEGER             CHECK (score >= 0)
);
CREATE TABLE alliances (
    id              SERIAL PRIMARY KEY,
    allianceOwner   INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    name            VARCHAR(20)         UNIQUE,
    score           INTEGER DEFAULT 0   CHECK (score >= 0) 
);
CREATE TABLE allianceMembers (
    id              SERIAL PRIMARY KEY,
    alliance        INTEGER REFERENCES alliances(id) ON DELETE CASCADE,
    member          INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    chainRank       INTEGER             CHECK (chainRank >= 1),
    UNIQUE(alliance, member, chainRank)
);