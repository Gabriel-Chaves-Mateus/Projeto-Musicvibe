# Curls da Parte A — Atividade 10 (tire um print de cada, em .jpg)

Todos foram automatizados em `script-testes-parte-a.sh` (resultado de referência abaixo).
Tokens: `$TA` (conta A, dona da música) e `$TB` (conta B). `$ID` = id de uma música da A.

## Curtidas
| # | Comando | Esperado |
|---|---|---|
| 1 | `curl -i -X POST localhost:3000/api/songs/$ID/toggle-like` | 401 |
| 2 | `curl -i -X POST localhost:3000/api/songs/99999/toggle-like -H "Authorization: Bearer $TB"` | 404 |
| 3 | B curte: `curl -i -X POST localhost:3000/api/songs/$ID/toggle-like -H "Authorization: Bearer $TB"` | 201, `liked:true`, `likesCount:1` |
| 4 | B de novo | 200, `liked:false`, `likesCount:0` |
| 5 | B de novo | 201, `likesCount:1` |
| 6 | A curte (com `$TA`) | 201, `likesCount:2` |
| 7 | `curl -s localhost:3000/api/songs/$ID/like-status` (sem token) | `liked:false` |
| 8 | o mesmo com `$TB` | `liked:true` |
| 9 | `curl -s localhost:3000/api/songs/$ID` (visitante) e com `$TB` | `isLiked` false / true |
| 10 | `curl -i localhost:3000/api/liked-songs` | 401 |
| 11 | `curl -s localhost:3000/api/liked-songs -H "Authorization: Bearer $TB"` | músicas curtidas, cada uma com `author` |

## Comentários
| # | Comando | Esperado |
|---|---|---|
| 12 | `curl -i -X POST localhost:3000/api/songs/$ID/comments -H "Content-Type: application/json" -d '{"content":"oi"}'` | 401 |
| 13 | com `$TB` e `-d '{"content":"     "}'` | 400 |
| 14 | com 501 caracteres | 400 |
| 15 | em `/songs/99999/comments` | 404 |
| 16 | com `$TB` e `-d '{"content":"   Primeiro comentário!   "}'` | 201, texto aparado e `author` |
| 17 | `curl -s localhost:3000/api/songs/$ID/comments` (sem token) | 200, mais novos primeiro |
| 18 | `curl -s localhost:3000/api/songs/$ID` | `commentsCount` igual ao número de itens |

## Exclusão e título só com espaços
- Crie uma música, curta e comente com a B, e então `curl -i -X DELETE localhost:3000/api/songs/$NID -H "Authorization: Bearer $TA"` → 200. No banco: `SELECT COUNT(*) FROM likes WHERE song_id=$NID;` e o mesmo em `comments` → 0. Os arquivos saem das pastas e `songs_count` do usuário cai 1.
- Título só com espaços: o `curl -F` apara os espaços sozinho, então use `node teste-trim-titulo.mjs $TA` (script desta pasta) → 400 `O título é obrigatório.`

## Restrição única (print `unique.jpg`)
No cliente do banco (Workbench, DBeaver ou `mysql`), com `$ID` e o `user_id` da B que já curtiu:
```sql
INSERT INTO likes (user_id, song_id, created_at, updated_at) VALUES (2, <ID>, NOW(), NOW());
-- ERROR 1062 (23000): Duplicate entry '2-<ID>' for key 'idx_unique_user_song_like'
SHOW CREATE TABLE likes;   -- mostra o UNIQUE KEY composto
```

## Resultado de referência
Sem token 401; inexistente 404; B 201/1 → 200/0 → 201/1; A 201/2; like-status visitante false e B true; detalhe `isLiked` false / true;
INSERT repetido recusado com `Duplicate entry '2-18' for key 'idx_unique_user_song_like'`; liked-songs sem token 401 e com B lista com autor;
comentário sem token 401, só espaços 400, 501 caracteres 400, inexistente 404, sucesso 201 com texto aparado e autor;
lista pública mais nova primeiro e `commentsCount` igual ao total; exclusão: likes 1→0, comments 1→0, `songs_count` 3→2, arquivos 4/4→3/3;
título só com espaços 400.
