UPDATE accounts SET uname = 'xray0' WHERE uname = 'xray';
UPDATE accounts SET uname = 'yankee1' WHERE uname = 'yankee';
UPDATE accounts SET uname = 'zulu2' WHERE uname = 'zulu';
UPDATE accounts SET uname = CONCAT(uname,'_1') WHERE id < 15;
UPDATE highscores SET score = score * 3 WHERE score < 105;
UPDATE highscores SET score = score * 2 WHERE score > 105;
UPDATE allianceMembers SET chainRank = chainRank + 1 WHERE chainRank != 1 and (chainRank < 3 or chainRank > 3);
UPDATE allianceMembers SET chainRank = 2 WHERE chainRank = 3;