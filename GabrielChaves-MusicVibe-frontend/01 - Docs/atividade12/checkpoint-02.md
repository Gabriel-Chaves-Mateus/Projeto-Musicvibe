# Checkpoint 2 — Leitura guiada do back-end (MusicVibe)

Escopo: `modules/` (user, song, like, comment, follow, search), `middlewares/`, `utils/`, `config/`, `app.js`.
Método: busca por texto no projeto inteiro (Ctrl+Shift+F) e leitura de cada resultado.

## 2.1 Camadas (Route → Controller → Service → Model)

| Pergunta | Resposta |
|---|---|
| Algum controller fala direto com o Sequelize? | **Não.** Controllers só chamam o service e `success(...)`. |
| Algum service usa `req`/`res`? | **Não.** Services recebem valores simples (ids, dados, arquivos). |
| Alguma rota sem `asyncHandler`? | **Não.** As 24 rotas com handler assíncrono usam `asyncHandler(...)`; só `searchRoutes.js` (síncrona, stub) não usa. |
| Algum módulo conhece o model de outro? | **Sim, 3 casos (acoplamento aceito por enquanto):** `songService` importa `Like`/`Comment`/`Follow` (linhas 7 e 227-228) e `userService` importa `Song` e `Follow` (`getPublicProfile`). |
| Rota sem implementação real? | **Sim:** `modules/search/searchService.js` devolve `{ songs: [], users: [] }` fixo (stub, não faz parte desta atividade). |

## 2.2 Validação de entrada

- Rotas com `:id` têm validator de parâmetro (`songIdValidator`, `songIdParamValidator`, `userIdParamValidator`): **sim**, todas as 12 rotas com `:id`/`:songId`/`:userId`. (`GET /profile/:username` não tem validator, mas um nome inexistente já responde 404.)
- Rotas de escrita com validator de corpo: register, login, profile, create/update song, comment: **sim**.
- Rotas com `req.query` (feeds) usam `parsePagination`: **sim**, após a correção de hoje (ver Etapa 2).
- Problema: `/api/search` não valida `req.query` (`modules/search/searchRoutes.js:6`): **sim, há um problema**, hoje inócuo porque o service é um stub; precisa de validator quando a busca existir.
- `validate`/tratamento de `validationResult` repetido em 4 arquivos (`songValidator.js:11`, `likeValidator.js:15`, `commentValidator.js:11`, `followValidator.js:15`; `userValidator.js:13`): **sim, há repetição** (ver pendência na Seção 13).

## 2.3 Erros e códigos de status

| Pergunta | Resposta |
|---|---|
| O `errorHandler` é o único lugar que escreve respostas de erro? | **Sim** (`middlewares/errorHandler.js`). |
| Algum `throw new Error` sem `status` vira 500 sem querer? | **Sim, 3 casos de serviço encontrados e corrigidos hoje** em `userService.js`: e-mail/usuário duplicado (`:75`, agora **409**), e-mail/senha inválidos (`:163` e `:172`, agora **401**) e usuário bloqueado (`:176`, agora **403**). Sintoma: login com senha errada aparecia como **500** nos logs e no Console. A mensagem chegava certa ao formulário, mas o código de status estava errado. |
| Outros `throw new Error` sem status? | 3 dentro de validadores customizados (`userValidator.js:63`, `songValidator.js:37` e `:44`): são capturados pelo `express-validator` e viram 400, **sem problema**. `config/jwt.js:7` falha na inicialização, de propósito. |
| Mensagens iguais para erros diferentes? | "Música não encontrada." definida em 3 services (`songService.js:28`, `likeService.js:7`, `commentService.js:13`): repetição, não bug. |

## 2.4 Transações (escritas em mais de uma tabela)

| Service | Escritas | Em transação? |
|---|---|---|
| `songService.createSong` (`:33`) | `songs` + `users.songsCount` | **Sim** (`:36`, com `{ transaction }` nas duas escritas; testado: 201 e contador +1) |
| `songService.deleteSong` (`:219`) | apaga curtidas, comentários, música + `songsCount` | **Sim** (`:224`) |
| `likeService.toggleLike` (`:14`) | `likes` + `songs.likesCount` | **Sim** (`:17`) |
| `commentService.createComment` (`:20`) | `comments` + `songs.commentsCount` | **Sim** (`:21`) |
| `followService.toggleFollow` (`:14`) | `follows` + 2 contadores de `users` | **Sim** (`:21`) |
| `songService.getSongDetails` (`:59`) | `playsCount` (1 escrita, 1 tabela) | Não precisa de transação, mas **é uma leitura (GET) que escreve** (`:67`): efeito colateral anotado como pendência. |
| `userService.registerUser` / `updateUserProfile` | 1 tabela | Não precisa. |

Resultado: não há mais escrita dupla fora de transação.

## 2.5 IDs inválidos (os três `curl` pedidos e mais alguns)

| Rota | Status |
|---|---|
| `GET /api/songs/abc` | **400** |
| `POST /api/songs/abc/toggle-like` | **400** |
| `POST /api/users/abc/toggle-follow` | **400** |
| `GET /api/users/abc/followers`, `GET /api/songs/abc/comments`, `GET /api/songs/abc/stream`, `DELETE /api/songs/abc`, `PUT /api/songs/abc` | **400** (todas) |
| `GET /api/songs/99999`, `GET /api/users/99999/followers`, `GET /api/profile/inexistente` | **404** |

Os módulos respondem com o **mesmo status** (400 para id inválido, 404 para inexistente). Print: `curl-4-id-invalido.jpg`.

## 2.6 Paginação

- O `limit`/`page` vinham de lugares diferentes? **Sim.** Os dois feeds tinham padrões diferentes (**10** no geral e **12** no filtrado, ver `paginacao-antes.jpg`): dois "tamanhos de página" para a mesma tela; hoje ambos usam `PAGINATION.DEFAULT_LIMIT` (12).
- `?limit=-3`, `?limit=100000`, `?page=-2&limit=2`: antes da correção, os validators devolviam **400**, sem proteger os valores padrão; depois, `parsePagination` normaliza (ver `paginacao-antes.jpg` e `paginacao-depois.jpg`).
- Tamanho de página solto em `modules/`: **não** há mais (busca por `limit = 1`/`|| 12`/`10` não encontra nada; só `PAGINATION.*`).

## Perguntas extras

1. **Padrão `const error = new Error(...)` / `error.status = N` / `throw error`:** aparece **22 vezes** (22 atribuições de `error.status`, 13 `throw error`), em 14 arquivos: `middlewares/auth.js`, `middlewares/profileMulter.js`, `middlewares/songMulter.js`, `modules/comment/commentService.js`, `commentValidator.js`, `modules/follow/followController.js`, `followService.js`, `followValidator.js`, `modules/like/likeService.js`, `likeValidator.js`, `modules/song/songService.js`, `songValidator.js`, `modules/user/userService.js`, `userValidator.js`.
2. **Outro valor numérico solto em mais de um arquivo:** `5 * 1024 * 1024` (5 MB) aparecia em `config/constants.js` (`COVER_MAX_SIZE`) **e** em `middlewares/profileMulter.js:50`. **Corrigido hoje:** novo `UPLOAD.PROFILE_MAX_SIZE` em `constants.js`, usado no `profileMulter`. (No front, `1024 * 1024` aparece em `UploadMusicView.vue` apenas para converter MB em bytes.)
3. **Três `curl` de id inválido:** ver 2.5; mesmo status (400).

---

# Seção 13 — Pendências (ADR-013)

| O que é | Por que não foi resolvido hoje | Em qual aula será resolvido |
|---|---|---|
| O tratamento de `validationResult` (`validate`) está copiado em 5 validators (`songValidator.js:11`, `likeValidator.js:15`, `commentValidator.js:11`, `followValidator.js:15`, `userValidator.js:13`), junto com o padrão `new Error` + `status`. | Este é um checkpoint sem funcionalidade nova; extrair um `validate` compartilhado e um helper de erro mexe em 14 arquivos e merece uma aula (e uma bateria de regressão) só para isso. | **Aula 13** (indicada pelo roteiro: _confirmar o número da aula no plano de ensino antes de entregar_). |
| `getSongDetails` (`songService.js:67`) incrementa `playsCount` dentro de um `GET` (a contagem sobe a cada F5 ou visita de robô). | Mudar para um evento/rota própria de "reproduziu" altera o contrato de front e API; não cabe num checkpoint. | **Aula 13** (_confirmar_), junto de qualquer revisão de contadores. |

> Pendência **resolvida hoje** (por não ter aula a nomear): `5 * 1024 * 1024` duplicado em `profileMulter.js` → `UPLOAD.PROFILE_MAX_SIZE`.
