# Curls da Parte A — Atividade 11 (tire um print de cada, em .jpg)

Todos foram automatizados em `script-testes-parte-a.sh` (prints de referência: `curl-1` a `curl-8`).
Contas: `$TA` (Ana, id 1), `$TB` (Bruno, id 2, dono de uma música), `$TC` (Carla, id 3, dona de uma música). `$IA`, `$IB`, `$IC` = ids.

| # | Comando | Esperado |
|---|---|---|
| 1 | `curl -i -X POST localhost:3000/api/users/$IB/toggle-follow` | 401 |
| 2 | `curl -i -X POST localhost:3000/api/users/abc/toggle-follow -H "Authorization: Bearer $TA"` | 400 |
| 3 | `curl -i -X POST localhost:3000/api/users/$IA/toggle-follow -H "Authorization: Bearer $TA"` (a si mesmo) | 400 |
| 4 | `curl -i -X POST localhost:3000/api/users/99999/toggle-follow -H "Authorization: Bearer $TA"` | 404 |
| 5 | A segue B (`$TA`, `$IB`) | 201, `isFollowing:true`, `followersCount:1` |
| 6 | A de novo | 200, `isFollowing:false`, `followersCount:0` |
| 7 | A de novo | 201, `followersCount:1` |
| 8 | C segue B (`$TC`, `$IB`) | 201, `followersCount:2` |
| 9 | B segue A (`$TB`, `$IA`) | 201 |
| 10 | `curl -s localhost:3000/api/profile/bruno` (e `ana`, `carla`) | Bruno 2/1, Ana 1/1, Carla 0/1 (seguidores/seguindo) |
| 11 | `curl -s localhost:3000/api/users/$IB/follow-status -H "Authorization: Bearer $TA"` | `isFollowing:true` (sem token: 401) |
| 12 | `curl -s localhost:3000/api/profile/bruno` visitante / com `$TA` / com `$TB` | `isFollowing` false / true / false (e `isOwner:true` para B) |
| 13 | `curl -s localhost:3000/api/users/$IB/followers` | Carla e Ana (mais recente primeiro), sem `password` |
| 14 | `curl -s localhost:3000/api/users/$IA/following` | Bruno |
| 15 | `curl -i localhost:3000/api/users/99999/followers` | 404 |
| 16 | `curl -i localhost:3000/api/following-songs` | 401 |
| 17 | `curl -s localhost:3000/api/following-songs -H "Authorization: Bearer $TA"` | só a música do Bruno |
| 18 | `curl -s "localhost:3000/api/following-songs?page=2&limit=1" -H "Authorization: Bearer $TA"` | `songs: []` |
| 19 | o mesmo com uma conta que não segue ninguém | `songs: []` |

## Restrição única (print `follows.jpg`)
```sql
INSERT INTO follows (follower_id, following_id, created_at, updated_at) VALUES (1, 2, NOW(), NOW());
-- ERROR 1062 (23000): Duplicate entry '1-2' for key 'idx_unique_follower_following'
```

> Observação: o feed filtrado devolve o mesmo formato do feed geral da Atividade 08 (`{ songs, page, limit, total, hasMore }`); "vazio" é `songs: []`.
