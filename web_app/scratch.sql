SELECT name, num_friends
FROM (SELECT login, COUNT(login) as num_friends FROM Friends GROUP BY login) C JOIN Person P ON C.login = P.login;

SELECT q.login, q.name, q.sex, q.relationshipStatus, q.birthyear, r.role FROM 
Person q JOIN (SELECT f.member, role, sex, relationshipStatus, birthyear
FROM (SELECT * FROM Person WHERE name = 'Ashton Westad') p JOIN Family f ON p.login = f.login) r ON q.login = r.member;
