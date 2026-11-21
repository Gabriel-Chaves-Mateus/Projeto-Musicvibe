# Curls da Parte A — Atividade 08 (tire um print de cada, em .jpg)

Pré-requisitos: API em `localhost:3000`, pelo menos uma música enviada (id 1 abaixo) e o token do dono:

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
  -d '{"email":"SEU_EMAIL","password":"SUA_SENHA"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['token'])")
```
(No Windows/PowerShell, copie o valor de `data.token` do login e use-o no lugar de `$TOKEN`.)

> **Ordem importa:** a contagem de visualizações sobe a cada chamada do detalhe. Para ver "1" e depois "2", faça os testes 1 e 2 em sequência numa música nova (ou ela já virá com a contagem acumulada).

## Detalhe
| # | Comando | Esperado |
|---|---|---|
| 1 | `curl -i http://localhost:3000/api/songs/1` | 200, `isOwner: false`, `playsCount` +1 |
| 2 | `curl -i http://localhost:3000/api/songs/1 -H "Authorization: Bearer $TOKEN"` | 200, `isOwner: true`, `playsCount` +1 |
| 3 | `curl -i http://localhost:3000/api/songs/9999` | 404 `Música não encontrada.` |

O autor vem em `author` (id, username, fullName, profilePicture): sem senha nem e-mail.

## Feed
| # | Comando | Esperado |
|---|---|---|
| 4 | `curl -i http://localhost:3000/api/feed` | 401 |
| 5 | `curl -i "http://localhost:3000/api/feed?page=1&limit=1" -H "Authorization: Bearer $TOKEN"` | 200, 1 item em `songs`, `hasMore` |
| 6 | `curl -i "http://localhost:3000/api/feed?page=2&limit=1" -H "Authorization: Bearer $TOKEN"` | próximo item (ou `songs: []` se só houver um) |

## Streaming (Grupo A)
| # | Comando | Esperado |
|---|---|---|
| 7 | `curl -i http://localhost:3000/api/songs/1/stream` | 401 |
| 8 | `curl -s -o /dev/null -D - http://localhost:3000/api/songs/1/stream -H "Authorization: Bearer $TOKEN"` | 200, `Accept-Ranges: bytes`, `Content-Type` do áudio |
| 9 | `curl -s -o /dev/null -D - http://localhost:3000/api/songs/1/stream -H "Authorization: Bearer $TOKEN" -H "Range: bytes=0-1023"` | **206**, `Content-Range: bytes 0-1023/<total>` |
| 10 | `curl -s -o /dev/null -D - http://localhost:3000/uploads/songs/audio/NOME_DO_ARQUIVO.mp3` | **200 sem token nenhum** (a inconsistência: o mesmo arquivo é público pelo estático e protegido pelo /stream) |

Troque `NOME_DO_ARQUIVO.mp3` pelo valor do campo `audio` devolvido no detalhe.

## Resultado obtido nos testes (referência)
Detalhe 200 / isOwner false / playsCount 1; com token do dono 200 / isOwner true / playsCount 2; id inexistente 404; id inválido 400;
feed sem token 401; `page=1&limit=1` → 1 item; `page=3&limit=1` → último item com `hasMore:false`; `limit=999` → 400;
`/stream` sem token 401; com token 200; com `Range: bytes=0-1023` 206 e `Content-Range: bytes 0-1023/32044`; `Range: bytes=999999-` 416;
arquivo estático sem token 200.
