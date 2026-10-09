INSERT INTO sessions (id, game, date, time, players, notes, status, report)
VALUES
('1', 'Valorant', '2026-09-12', '20:00', '["MP","GM","PL","AB","CD"]'::jsonb, 'Casual ranked grind', 'planned', NULL),
('2', 'Apex Legends', '2026-09-06', '21:00', '["MP","GM"]'::jsonb, '', 'completed', '{"result":"Loss","score":"2-3","rating":3,"note":"Close match, GG"}'::jsonb),
('3', 'Valorant', '2026-08-29', '20:00', '["MP","GM","PL"]'::jsonb, '', 'completed', '{"result":"Win","score":"13-7","rating":5,"note":"Clutch round 20"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO games (id, label, votes) VALUES
('valorant', 'Valorant', 3),
('apex', 'Apex Legends', 2),
('csgo', 'CS:GO', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO availability (id, data) VALUES (1, '{
  "mine": {
    "Mon":{"checked":false,"start":"","end":""},
    "Tue":{"checked":false,"start":"","end":""},
    "Wed":{"checked":false,"start":"","end":""},
    "Thu":{"checked":false,"start":"","end":""},
    "Fri":{"checked":true,"start":"20:00","end":"22:00"},
    "Sat":{"checked":true,"start":"20:00","end":"23:00"},
    "Sun":{"checked":false,"start":"","end":""}
  },
  "others":[
    {"name":"Member A","days":"Fri, Sat"},
    {"name":"Member B","days":"Sat, Sun"},
    {"name":"Member C","days":"Fri"}
  ]
}'::jsonb)
ON CONFLICT (id) DO NOTHING;
