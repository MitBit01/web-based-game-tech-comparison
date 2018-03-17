SELECT uname FROM accounts;
SELECT
    accounts.uname,
    highscores.score
FROM highscores
    INNER JOIN accounts ON accounts.id = highscores.recordAccount
ORDER BY highscores.score
LIMIT 10;
SELECT 
    accounts.uname,
    alliances.name,
    allianceMembers.chainRank
FROM ((allianceMembers
    INNER JOIN alliances ON allianceMembers.alliance = alliances.id)
    INNER JOIN accounts ON allianceMembers.member = accounts.id)
ORDER BY allianceMembers.chainRank;