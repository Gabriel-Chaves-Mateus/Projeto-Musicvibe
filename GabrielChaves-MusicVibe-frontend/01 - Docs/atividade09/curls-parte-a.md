# Curls da Parte A — Atividade 09 (tire um print de cada, em .jpg)

Todos os testes foram automatizados em `script-testes-parte-a.sh` (resultado de referência abaixo). Para os prints, rode os comandos na mão.
**Antes e depois dos testes 4, 5 e 6, mostre a contagem de arquivos** (`ls public/uploads/songs/covers | wc -l` e `ls public/uploads/songs/audio | wc -l`, na pasta do back-end).

Tokens: faça login com a conta A e com a conta B e guarde em `$TA` e `$TB`. IDs: use o `id` de uma música da A (`$ID`).
Para os uploads de teste use `;type=...` no curl (por exemplo `-F "cover=@capa.jpg;type=image/jpeg"`).

| # | Comando | Esperado |
|---|---|---|
| 1a | `curl -i localhost:3000/api/my-songs` | 401 |
| 1b | `curl -s localhost:3000/api/my-songs -H "Authorization: Bearer $TA"` | lista da A, mais nova primeiro |
| 1c | `curl -s localhost:3000/api/my-songs -H "Authorization: Bearer $TB"` (B sem músicas) | `data: []` |
| 2a | `curl -i localhost:3000/api/songs/$ID/edit` | 401 |
| 2b | `... /edit -H "Authorization: Bearer $TB"` | 403 |
| 2c | `curl -i localhost:3000/api/songs/99999/edit -H "Authorization: Bearer $TA"` | 404 |
| 2d | `... /songs/$ID/edit -H "Authorization: Bearer $TA"` | 200 (`playsCount` não muda) |
| 3 | `curl -i -X PUT localhost:3000/api/songs/$ID -H "Authorization: Bearer $TA" -F title="Novo" -F description="x"` | 200, mesma capa, contagem de arquivos igual |
| 4 | o mesmo PUT com `-F "cover=@capa2.jpg;type=image/jpeg"` | 200, nome da capa mudou, contagem de arquivos igual |
| 5a | PUT com capa feito pela **B** | 403, contagem de arquivos não sobe |
| 5b | PUT com capa e `-F title=""` feito pela **A** | 400, contagem de arquivos não sobe |
| 6a | `curl -i -X DELETE localhost:3000/api/songs/$ID -H "Authorization: Bearer $TB"` | 403 |
| 6b | o mesmo com `$TA` | 200; arquivos somem; `songsCount` cai 1 |
| 6c | `curl -i localhost:3000/api/songs/$ID` | 404 |
| 6d | repetir o DELETE da A | 404 |
| 7a | `curl -s localhost:3000/api/profile/<username>` | `isOwner: false`, `songs` ordenadas |
| 7b | com o token do dono | `isOwner: true` |
| 7c | com o token da B | `isOwner: false` |
| 7d | `curl -i localhost:3000/api/profile/fantasma` | 404 |

Contador: `curl -s localhost:3000/api/profile/me -H "Authorization: Bearer $TA"` mostra `songsCount`.

## Resultado de referência (rodado no ambiente de teste)
my-songs sem token 401 / A lista (nova → antiga) / B `[]`; edit: sem token 401, B 403, inexistente 404, A 200;
PUT só texto 200 com arquivos 3/3 antes e depois; PUT com capa 200 com capa trocada e a antiga apagada (3/3);
PUT da B com capa 403 (3/3 antes e depois) e PUT da A com título vazio 400 (3/3 antes e depois);
DELETE da B 403, da A 200, GET 404, arquivos 3/3 → 2/2, `songsCount` 3 → 2, repetir DELETE 404;
perfil anônimo `isOwner:false` (lista ordenada), dono `true`, B `false`, usuário inexistente 404, `/profile/me` continua funcionando.
