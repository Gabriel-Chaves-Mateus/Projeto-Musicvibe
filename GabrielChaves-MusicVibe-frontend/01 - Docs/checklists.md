# Checklists do Projeto MusicVibe

Projeto: MusicVibe - Plataforma de Streaming de Música

---

# Atividade 01 - Setup do Ambiente e Primeiro Marco de Integração

## Backend

- [x] Projeto Node.js/Express criado
- [x] Dependências principais instaladas
- [x] Estrutura modular do backend criada
- [x] Pasta `bin/` criada
- [x] Pasta `config/` criada
- [x] Pasta `middlewares/` criada
- [x] Pasta `modules/` criada
- [x] Pasta `routes/` criada
- [x] Arquivo `bin/www` configurado
- [x] Script `npm start` configurado
- [x] Script `npm run dev` configurado com Nodemon
- [x] Arquivo `.env` criado
- [x] Variável `PORT` configurada
- [x] CORS configurado por variável de ambiente
- [x] Middleware `apiResponse.js` criado
- [x] Função de resposta de sucesso implementada
- [x] Função de resposta de erro implementada
- [x] Rota `GET /api` criada
- [x] Rota `/api` retorna status `online`
- [x] Estrutura JSON padronizada implementada

## Frontend

- [x] Projeto Vue 3 criado com Vite
- [x] Vue Router instalado e configurado
- [x] Axios instalado
- [x] Pinia instalado
- [x] Estrutura de pastas do frontend criada
- [x] Pasta `views/` criada
- [x] Pasta `components/` criada
- [x] Pasta `router/` criada
- [x] Pasta `services/` criada
- [x] Pasta `stores/` prevista na estrutura
- [x] `TheNavbar.vue` criado
- [x] `TheSidebar.vue` criado
- [x] `TheFooter.vue` criado
- [x] Layout principal configurado no `App.vue`
- [x] Rotas principais do MusicVibe cadastradas
- [x] Telas placeholder criadas
- [x] Landing Page criada
- [x] Landing consome o backend
- [x] Status da API exibido na Landing
- [x] Integração frontend/backend funcionando

## Testes

- [x] Backend iniciado corretamente
- [x] Frontend iniciado corretamente
- [x] `GET /api` testado
- [x] Status `online` exibido no frontend
- [x] Erro de CORS provocado propositalmente
- [x] Correção/configuração do CORS validada

## Documentação

- [x] Prints da atividade salvos
- [x] Print do teste da API salvo
- [x] Print da Landing com API online salvo
- [x] Print do erro de CORS salvo
- [x] Documentação das funcionalidades/telas criada
- [x] Backend compactado sem `node_modules`
- [x] Frontend compactado sem `node_modules`

---

# Atividade 02 - Módulo de Busca e Camada de Comunicação com a API

## Backend

- [x] Primeiro módulo funcional criado em `modules/search`
- [x] Estrutura Route → Controller → Service implementada
- [x] `searchRoutes.js` criado
- [x] `searchController.js` criado
- [x] `searchService.js` criado
- [x] Endpoint `GET /api/search` criado
- [x] Parâmetro de busca `q` implementado
- [x] Campo principal de busca definido como `songs`
- [x] Busca retorna estrutura padronizada
- [x] Retorno inclui `query`
- [x] Retorno inclui `songs`
- [x] Retorno inclui `users`
- [x] Busca sem persistência retorna arrays vazios

## Frontend

- [x] Axios centralizado em `src/services/api.js`
- [x] `VITE_API_URL` configurado
- [x] Interceptor de resposta configurado
- [x] Respostas de sucesso normalizadas
- [x] Erros HTTP tratados
- [x] Erros de conexão tratados
- [x] Erros inesperados tratados
- [x] `authService.js` criado
- [x] `searchService.js` criado
- [x] `systemService.js` criado
- [x] Landing refatorada para usar `systemService`
- [x] Uso direto de `fetch` removido da Landing
- [x] Serviço de busca testado no frontend

## Testes

- [x] Endpoint `/api/search?q=...` testado
- [x] Busca testada pelo terminal
- [x] Busca testada pelo frontend
- [x] Resultado da busca visualizado no Console
- [x] Erro de rede provocado e tratado
- [x] Interceptor de erros validado

## Documentação

- [x] Ficha do projeto atualizada
- [x] Campo de busca `songs` registrado na ficha
- [x] Print do teste de busca salvo
- [x] Print da busca no Console salvo
- [x] Print do erro de rede salvo
- [x] Backend compactado sem `node_modules`
- [x] Frontend compactado sem `node_modules`

---

# Atividade 03 - Persistência de Dados e Primeiro Cadastro Real

## Banco de Dados

- [x] MySQL instalado e configurado
- [x] Banco `musicvibe_db` criado
- [x] Sequelize instalado
- [x] Driver `mysql2` instalado
- [x] Conexão com MySQL configurada
- [x] Arquivo `config/database.js` criado
- [x] Variáveis do banco adicionadas ao `.env`
- [x] Sincronização com `sequelize.sync({ alter: true })` implementada
- [x] Tabela `users` criada

## Backend

- [x] `bcryptjs` instalado
- [x] `express-validator` instalado
- [x] Modelo `User` criado
- [x] Campo `username` criado
- [x] Campo `email` criado
- [x] Campo `password` criado
- [x] Campo `fullName` criado
- [x] Campo `bio` criado
- [x] Campo `profilePicture` criado
- [x] Campo `followersCount` criado
- [x] Campo `followingCount` criado
- [x] Campo `songsCount` criado
- [x] Campo `isBlocked` criado
- [x] Campo `isAdmin` criado
- [x] Username configurado como único
- [x] E-mail configurado como único
- [x] Arquivo `config/constants.js` criado
- [x] Validações de cadastro implementadas
- [x] Confirmação de senha implementada
- [x] Middleware `asyncHandler.js` criado
- [x] Middleware global `errorHandler.js` criado
- [x] Senha criptografada com bcrypt
- [x] Senha em texto puro não é retornada pela API
- [x] Verificação de e-mail duplicado implementada
- [x] Verificação de username duplicado implementada
- [x] Endpoint `POST /api/register` criado
- [x] Endpoint `GET /api/profile/:username` criado
- [x] Perfil público retorna apenas campos permitidos

## Frontend

- [x] `RegisterView.vue` transformado em formulário funcional
- [x] Campo de nome completo implementado
- [x] Campo de username implementado
- [x] Campo de e-mail implementado
- [x] Campo de senha implementado
- [x] Campo de confirmação de senha implementado
- [x] Validação do formulário no frontend implementada
- [x] Mensagens de erro por campo implementadas
- [x] Registro conectado ao `authService`
- [x] Cadastro real enviado ao backend
- [x] Redirecionamento para Login após cadastro implementado
- [x] Erro de duplicidade exibido ao usuário
- [x] Link "Criar Conta" incluído na Navbar

## Testes

- [x] Cadastro com dados válidos testado
- [x] Usuário persistido no MySQL
- [x] Hash bcrypt confirmado no banco
- [x] Senha curta testada
- [x] Validação de senha curta funcionando
- [x] Cadastro duplicado testado
- [x] Erro de duplicidade confirmado
- [x] Perfil público testado
- [x] `songsCount` retornando valor padrão `0`

## Documentação

- [x] Ficha do projeto atualizada
- [x] Banco `musicvibe_db` registrado na ficha
- [x] Campo `songsCount` registrado na ficha
- [x] Print da tabela `users` salvo
- [x] Print do cadastro salvo
- [x] Print do erro de validação salvo
- [x] Print do perfil público salvo
- [x] Print dos erros do formulário salvo
- [x] Print de duplicidade salvo
- [x] Backend compactado sem `node_modules`
- [x] Frontend compactado sem `node_modules`

---

# Atividade 04 - Login com JWT, Pinia e Proteção de Rotas

## Backend

- [x] Pacote `jsonwebtoken` instalado
- [x] `JWT_SECRET` adicionado ao `.env`
- [x] `JWT_EXPIRES_IN` adicionado ao `.env`
- [x] Arquivo `config/jwt.js` criado
- [x] Geração de token JWT implementada
- [x] Verificação de token JWT implementada
- [x] Middleware `middlewares/auth.js` criado
- [x] Middleware `isAuthenticated` implementado
- [x] `loginUser` adicionado ao `userService.js`
- [x] `getUserProfile` adicionado ao `userService.js`
- [x] `loginValidator` adicionado ao `userValidator.js`
- [x] Método `login` adicionado ao Controller
- [x] Método `logout` adicionado ao Controller
- [x] Método `getMyProfile` adicionado ao Controller
- [x] Endpoint `POST /api/login` criado
- [x] Endpoint `POST /api/logout` criado
- [x] Endpoint protegido `GET /api/profile/me` criado
- [x] `/profile/me` posicionado antes de `/profile/:username`
- [x] JWT retorna identificação do usuário
- [x] JWT não armazena dados sensíveis
- [x] Logout stateless implementado

## Testes do Backend

- [x] Login válido retorna JWT
- [x] Login retorna dados do usuário
- [x] Retorno do login inclui `isAdmin`
- [x] Login com senha incorreta retorna erro
- [x] `/api/profile/me` sem token retorna 401
- [x] `/api/profile/me` com token válido retorna perfil
- [x] `/api/profile/me` com token inválido retorna 401

## Frontend

- [x] Pinia registrado no `main.js`
- [x] Pinia registrado antes do Vue Router
- [x] Store `src/stores/auth.js` criada
- [x] Token armazenado no `localStorage`
- [x] Usuário armazenado no `localStorage`
- [x] Sessão restaurada após recarregar a página
- [x] Interceptor de requisição do Axios implementado
- [x] Header `Authorization: Bearer <token>` adicionado automaticamente
- [x] Interceptor de resposta atualizado
- [x] Erro 401 tratado automaticamente
- [x] Token removido após 401
- [x] Usuário removido após 401
- [x] Redirecionamento automático para Login após 401
- [x] Chaves do `localStorage` consistentes
- [x] Bootstrap 5 adicionado via CDN
- [x] Cor de marca do MusicVibe definida como `#7C3AED`
- [x] Arquivo `assets/main.css` criado
- [x] Tela de Login estilizada
- [x] Login conectado ao `authStore.login()`
- [x] Login funcional
- [x] Guarda global de rotas implementada
- [x] Rotas com `requiresAuth: true` protegidas
- [x] `useAuthStore()` utilizado dentro do callback da guarda
- [x] Sessão validada no backend ao acessar rota protegida
- [x] Navbar alterada conforme estado de autenticação
- [x] Login e Criar Conta exibidos quando deslogado
- [x] Perfil e Sair exibidos quando logado
- [x] Logout funcional

## Testes do Frontend

- [x] Login redireciona para `/feed`
- [x] Token e usuário aparecem no `localStorage`
- [x] Sessão continua ativa após F5
- [x] Logout remove a sessão
- [x] Rota protegida redireciona usuário deslogado
- [x] URL de Login mantém `?redirect=...`
- [x] Após Login, usuário retorna para a rota originalmente solicitada
- [x] Console exibe `Perfil autenticado OK:`
- [x] Token adulterado manualmente é rejeitado
- [x] Token adulterado gera 401 no backend
- [x] Sessão é automaticamente apagada após token inválido
- [x] Usuário é automaticamente redirecionado para Login

## Documentação

- [x] Ficha do projeto atualizada com a cor `#7C3AED`
- [x] Print `login-sucesso`
- [x] Print `login-senha-incorreta`
- [x] Print `profile-sem-token-401`
- [x] Print `profile-token-valido`
- [x] Print `profile-token-invalido-401`
- [x] Print `login-estilizado`
- [x] Print `sessao-localstorage`
- [x] Print `rota-protegida-redirect`
- [x] Print `redirect-pos-login`
- [x] Print `perfil-autenticado-console`
- [x] Print `logout-token-invalido`
- [x] Backend compactado sem `node_modules`
- [x] Frontend compactado sem `node_modules`
- [x] Pasta `stores/` incluída no frontend entregue

---

# Atividade 05 - Upload de Arquivos e Edição de Perfil

## Backend

- [x] Pasta `public/uploads/profiles/` criada
- [x] `default-profile.png` incluído
- [x] Multer instalado
- [x] `BIO_MAX` adicionado
- [x] `profileMulter.js` criado
- [x] Pasta de uploads servida com `express.static`
- [x] `profileUpdateValidator` criado
- [x] `updateUserProfile` criado
- [x] `updateProfile` criado
- [x] `PUT /api/profile/me` criado
- [x] Atualização sem foto testada
- [x] Atualização com foto testada
- [x] Remoção de foto antiga validada
- [x] Upload público testado
- [x] Bio acima do limite retorna 400

## Frontend

- [x] Link `Meu Perfil` adicionado à Navbar
- [x] Link aparece somente quando autenticado
- [x] `.env` atualizado
- [x] `utils/media.js` criado
- [x] `updateProfile(formData)` criado
- [x] Multipart configurado apenas na chamada de upload
- [x] Tela de Meu Perfil criada
- [x] Dados reais carregados
- [x] Nome e bio editáveis
- [x] Preview local implementado
- [x] Upload de foto funcional
- [x] Salvamento com e sem foto funcionando

# Situação Geral

- [x] Atividade 01 concluída
- [x] Atividade 02 concluída
- [x] Atividade 03 concluída
- [x] Atividade 04 concluída
- [x] Atividade 05 concluída

---

# Atividade 06 - Checkpoint 1: Componentização, useAuth() e Acerto de Contas Visual

## Parte A — Backend

- [x] `checkpoint-01.md` criado e respondido (`01 - Docs/atividade06/`)
- [x] Nenhuma linha de código nova no back-end
- [x] Todos os endpoints já construídos continuam respondendo como esperado

## Parte B — Frontend

- [x] `bootstrap-icons` incluído via CDN
- [x] Link do Bootstrap corrigido no `index.html` (`ref` → `rel`)
- [x] `BaseInput`, `BaseButton` e `FormCard` criados em `src/components/base/`
- [x] Registro, Login e Edição de Perfil refatorados para os componentes-base
- [x] Tela de Registro estilizada com a cor de marca `#7C3AED` (nenhuma cor nova)
- [x] `composables/useAuth.js` criado
- [x] Guarda de rota atualizado para usar `useAuth()`
- [x] Navbar atualizada para usar `useAuth()`
- [x] Sidebar atualizada para usar `useAuth()`
- [x] Nenhum link novo aponta para funcionalidade não construída (Favoritos, Playlists e Seguindo saíram da Sidebar)

## Testes

- [x] Cadastro → redireciona ao Login com a tela estilizada
- [x] Login → redireciona à tela principal
- [x] Navbar alterna entre logado/deslogado
- [x] Edição de Perfil mantém os três comportamentos da Atividade 05
- [x] Guarda de rota: deslogado em `/profile` → redireciona ao Login
- [x] Console do DevTools sem erros novos

## Prints (`01 - Docs/atividade06/`)

- [x] `registro-antes.jpg`
- [x] `registro-depois.jpg`
- [x] `tres-telas-consistentes.jpg`
- [x] `navbar-logado-deslogado.jpg`

## Entrega

- [x] Backend compactado sem `node_modules`
- [x] Frontend compactado sem `node_modules`, incluindo `components/base/` e `composables/`

# Situação Geral

- [x] Atividade 06 concluída


---

# Atividade 07 - Upload da Entidade Principal com Indicador de Progresso

## Backend (Parte A) — Grupo A (áudio + capa)

- [x] Pastas `public/uploads/songs/audio/` e `public/uploads/songs/covers/` criadas
- [x] `TITLE_MAX` adicionado a `VALIDATION` (`DESCRIPTION_MAX` também, pois ainda não existia no `constants.js`)
- [x] Model `Song` criado com `audio` e `cover`
- [x] `config/associations.js` criado (`User.hasMany(Song)` / `Song.belongsTo(User)`)
- [x] Middleware `songMulter.js` criado com `multer.fields([audio, cover])`
- [x] `songValidator`, `songService`, `songController` e `songRoutes` criados
- [x] Ordem de middlewares conferida (auth → multer → validator → controller)
- [x] Rota montada em `app.js`
- [x] `config/associations` carregado antes do `sync`
- [x] Tabela `songs` confirmada no banco, com FK `user_id`
- [x] Upload completo funciona e `songsCount` sobe
- [x] Casos de erro recusados com o status esperado (401, 400 sem título, 400 sem capa, 400 tipo inválido)

## Frontend (Parte B)

- [x] `songService.js` criado, recebendo `onUploadProgress` como parâmetro
- [x] `.progress-bar` e `.thumbnail-preview` adicionadas ao CSS
- [x] Formulário completo (título, descrição, áudio, capa)
- [x] Barra de progresso funcionando
- [x] Prévia da capa funcionando, sem chamada de rede
- [x] Link "Enviar Música" na Navbar e na Sidebar, visível só autenticado
- [x] Resposta de alcançabilidade escrita (`alcancabilidade.md`)

## Testes

- [x] Clique no link novo muda a URL sem recarregar
- [x] Envio vazio mostra os erros de campo obrigatório
- [x] Só um dos dois arquivos mostra o erro pedindo o outro
- [x] Prévia da capa sem nenhuma chamada de rede
- [x] Barra de progresso avança e aparece a mensagem de sucesso
- [x] `Content-Type: multipart/form-data; boundary=...` na requisição
- [x] Registro criado no banco e `songsCount` do usuário sobe

## Prints (`01 - Docs/atividade07/`)

- [x] `formulario-preenchido.jpg`
- [x] `progresso-upload.jpg`
- [x] `upload-multipart.jpg`
- [x] `link-envio.jpg`
- [x] Prints dos curls da Parte A

## Entrega

- [x] Backend e frontend compactados sem `node_modules`

# Situação Geral (atualizada)

- [x] Atividade 07 concluída


---

# Atividade 08 - Streaming, Detalhe da Entidade Principal e Feed Paginado

## Backend (Parte A) — Grupo A (possui streaming)

- [x] `middlewares/optionalAuth.js` criado
- [x] `getSongDetails` e `getFeedSongs` adicionados ao service
- [x] Controller e rota do detalhe criados, com `optionalAuth`
- [x] Coluna de visualizações criada (`playsCount`)
- [x] Rota de streaming (`/songs/:id/stream`) protegida por `isAuthenticated`
- [x] `Content-Type` ajustado ao tipo real do arquivo (mp3, wav, ogg)
- [x] `getFeed` adicionado a `userController.js` / `userRoutes.js`

### Testes
- [x] Detalhe sem token → 200, `isOwner: false`, contagem em 1
- [x] Detalhe com token do dono → 200, `isOwner: true`, contagem em 2
- [x] Detalhe de item inexistente → 404
- [x] `/stream` sem token → 401; com token → 200; com `Range: bytes=0-1023` → 206 com `Content-Range` correto
- [x] Mesmo arquivo via `/uploads/...` sem token → 200 (inconsistência reproduzida)
- [x] Feed sem token → 401
- [x] Feed `?page=1&limit=1` → um item só
- [x] Feed `?page=2&limit=1` → próximo item (ou `[]`)

## Frontend (Parte B)

- [x] `getSongAudioUrl` e `getSongCoverUrl` adicionadas a `utils/media.js`
- [x] Classes de card (`.song-card`, `.song-cover`, proporção 1:1) adicionadas
- [x] Classe de player (`.audio-player`) adicionada
- [x] `getSongById` e `getFeed` criadas em `services/songService.js`
- [x] Componente `SongCard.vue` criado
- [x] Feed com itens reais e paginação "Carregar mais"
- [x] Detalhe com player de áudio apontando para o arquivo estático (nunca `/stream`)
- [x] `isOwner` guardado no estado da tela

### Testes
- [x] Login → link "Feed" na Navbar/Sidebar → itens reais
- [x] Clique num card → detalhe sem recarregar a página
- [x] Player reproduz, seek livre, arquivo vem de `/uploads/...` e há resposta 206
- [x] Recarregar o detalhe sobe a contagem de visualizações
- [x] Id inexistente na URL → mensagem de erro, sem quebrar a tela

## Prints (`01 - Docs/atividade08/`)

- [x] `feed-real.jpg`
- [x] `detalhe-real.jpg`
- [x] `range-206.jpg`
- [x] Prints dos curls da Parte A

## Entrega

- [x] Backend e frontend compactados sem `node_modules`

# Situação Geral (atualizada)

- [x] Atividade 08 concluída


---

# Atividade 09 - CRUD do Item, Perfil Público e Limpeza de Arquivos Órfãos

## Backend (Parte A) — Grupo A

- [x] `reload()` no detalhe (Atividade 08) e duas chamadas seguidas devolvem contagens consecutivas
- [x] Verificação 404 antes de 403 (`findOwnedSong`, usada em edit/PUT/DELETE)
- [x] Ordem banco → disco respeitada (PUT e DELETE)
- [x] Contador `songsCount` decrementado na exclusão (na mesma transação)
- [x] Quatro handlers no controller (`getMySongs`, `getSongForEdit`, `updateSong`, `deleteSong`)
- [x] Quatro rotas, com Multer (`single('cover')`) antes do validador no PUT
- [x] `include` + `order` no nível de cima em `getPublicProfile`
- [x] `isOwner` devolvido no perfil público
- [x] `/profile/:username` com `optionalAuth`, depois de `/profile/me`
- [x] `errorHandler.js` limpa arquivos órfãos e continua sendo o último `app.use`

### Testes
- [x] `GET /my-songs`: 401 sem token; lista da A (mais nova primeiro); B → `[]`
- [x] `GET /songs/:id/edit`: 401; B 403; inexistente 404; A 200 sem mudar a contagem de visualizações
- [x] PUT só texto → 200, arquivo inalterado
- [x] PUT com capa nova → 200, nome mudou, contagem de arquivos igual
- [x] Órfãos: PUT da B 403 e PUT da A com título vazio 400, sem subir a contagem de arquivos
- [x] DELETE: B 403; A 200; GET 404; arquivos sumiram; contador caiu 1; repetir → 404
- [x] Perfil: anônimo (`isOwner:false`, lista ordenada), dono (`true`), B (`false`), inexistente 404

## Frontend (Parte B)

- [x] `composables/useClickOutside.js`
- [x] `components/base/BaseModal.vue`
- [x] `getMySongs`, `getSongForEdit`, `updateSong`, `deleteSong` e `getPublicProfile` criadas
- [x] Card sem `<a>` gigante, com autor clicável/opcional e slot `actions`
- [x] Feed da Atividade 08 continua funcionando
- [x] Menu do avatar: abre pelo clique, alinhado à direita, fecha ao clicar fora / em um item / com Esc
- [x] Perfil Público com os três casos (dono: Editar Perfil / logado: Seguir / visitante: nenhum)
- [x] Meus Itens com modal fora do card, `busy` e remoção local
- [x] Editar Item com e sem arquivo novo
- [x] Autor clicável e botão "Editar" condicional no Detalhe
- [x] Link para Meus Itens na mensagem de sucesso do Upload

### Testes
- [x] Menu do avatar (abre, fecha fora, Esc, item)
- [x] Ver Perfil; autor de outro card → perfil dela com "Seguir", sem recarregar
- [x] Anônimo em `/profile/<username>` sem "Seguir"/"Editar Perfil"; username inexistente → erro com tela intacta
- [x] Meus Itens: estado vazio com link; grade com Editar/Excluir; modal centralizado sem navegar; Cancelar/X/fora/Esc fecham; clicar dentro não fecha
- [x] Exclusão remove o item sem recarregar, apaga os arquivos e o contador cai
- [x] Edição: pré-preenchida, só texto mantém a capa, capa nova com prévia imediata e a antiga some; título vazio sem requisição
- [x] PUT com `Content-Type: multipart/form-data; boundary=...`
- [x] B na URL de edição de item da A → mensagem de permissão; id inexistente → não encontrado
- [x] Deslogado em Meus Itens → login → volta para a tela
- [x] "Editar" visível no detalhe do próprio item e ausente no de outra pessoa
- [x] Regressão: Feed, Detalhe, Upload, Meu Perfil, Login/Logout

## Prints (`01 - Docs/atividade09/`)

- [x] `menu-avatar.jpg`
- [x] `perfil-publico.jpg`
- [x] `modal-exclusao.jpg`
- [x] `editar.jpg`
- [x] Prints dos curls da Parte A (com a contagem de arquivos antes/depois dos testes 4, 5 e 6)
- [x] `respostas.md`

## Entrega

- [x] Backend e frontend compactados sem `node_modules`

# Situação Geral (atualizada)

- [x] Atividade 09 concluída


---

# Atividade 10 - Curtidas e Comentários

Nomes usados: `likesCount`, `commentsCount` (colunas em `songs`) e `songId` (chave estrangeira nas tabelas `likes` e `comments`).

## Backend (Parte A)

- [x] `COMMENT_MAX` e as colunas `likesCount` / `commentsCount` adicionados
- [x] Models `Like` e `Comment` criados, com índice único composto no `Like`
- [x] Associações nos dois sentidos (`config/associations.js`)
- [x] Tabelas e colunas conferidas no banco (FKs e UNIQUE KEY)
- [x] Módulo `like` completo (3 rotas) e registrado no `app.js`
- [x] Módulo `comment` completo (2 rotas, validador com `trim` primeiro) e registrado
- [x] Escritas duplas (linha + contador) dentro de transação, com `{ transaction }` em todos os comandos
- [x] Parâmetros `(userId, songId, content)` na mesma ordem no controller e no service
- [x] Comentário criado devolvido com o autor
- [x] Detalhe devolvendo `isLiked` e os contadores
- [x] Exclusão em transação, com limpeza de curtidas e comentários
- [x] Contadores no perfil público
- [x] `trim()` movido para o início nos campos obrigatórios (cadastro)

### Testes
- [x] Curtir sem token 401; inexistente 404
- [x] B curte 201 / descurte 200 / curte 201; A curte → 2
- [x] like-status e `isLiked` no detalhe (visitante false, B true)
- [x] INSERT repetido recusado pelo índice único
- [x] `liked-songs` com B (itens com autor); sem token 401
- [x] Comentar: sem token 401, só espaços 400, 501 caracteres 400, inexistente 404, sucesso 201 com texto aparado e autor
- [x] Listar comentários sem token (200, mais novos primeiro; contador igual ao número de itens)
- [x] Excluir música com curtidas e comentários: sem linhas restantes, arquivos removidos, contador decrementado
- [x] Título só com espaços → 400
- [x] Regressão: upload, detalhe, feed, edição e perfil

## Frontend (Parte B)

- [x] `likeService.js` e `commentService.js`
- [x] `utils/format.js`
- [x] CSS (`.like-button`, `.comment-text`)
- [x] `LikeButton` com atualização otimista, rollback e `isBusy`
- [x] Visitante é levado ao login e volta
- [x] Lista de comentários com carregando/erro/vazio e formulário validado
- [x] Comentário novo no topo, sem recarregar a lista
- [x] Texto escapado (`{{ }}`) e quebras de linha preservadas
- [x] Detalhe com curtir + comentários
- [x] Contadores no card
- [x] Tela de itens curtidos com rota (`/liked-songs`) e acessível por um clique (Sidebar e menu do avatar)

### Testes
- [x] Visitante vê botão e lista, sem formulário; curtir leva ao login e volta ao detalhe
- [x] Logado: coração muda na hora; F5 mantém; descurtir desfaz
- [x] Rede lenta: o coração muda imediatamente; Offline: muda, volta e mostra a mensagem
- [x] Comentário vazio, só espaços e com mais de 500 caracteres: erro sem chamar a API
- [x] Comentário de duas linhas aparece no topo com as linhas preservadas, e o contador sobe
- [x] `<b>teste</b> <img src=x onerror="alert(1)">` aparece como texto, sem negrito e sem alerta
- [x] Contadores no card do Feed, do Perfil e de Meus Itens
- [x] Itens curtidos: descurtir no detalhe tira da lista
- [x] A exclui item com curtidas e comentários e ele some dos curtidos de B
- [x] Regressão: Feed, Perfil, Meus Itens, Upload, Login/Logout

## Prints (`01 - Docs/atividade10/`)

- [x] `detalhe-interacao.jpg`
- [x] `otimista.jpg`
- [x] `rollback.jpg`
- [x] `curtidos.jpg`
- [x] `unique.jpg`
- [x] Prints dos curls da Parte A
- [x] `respostas.md`

## Entrega

- [x] Backend e frontend compactados sem `node_modules`

# Situação Geral (atualizada)

- [x] Atividade 10 concluída


---

# Atividade 11 - Seguir Pessoas, Seguidores/Seguindo e o Feed de Quem Eu Sigo

## Backend (Parte A)

### Etapa 1 — Model Follow e Associações
- [x] `followModel.js` criado, com o índice único `['follower_id', 'following_id']` e o índice simples `['following_id']`
- [x] Associações com apelidos (`Follower` / `Following`) declaradas em `config/associations.js`
- [x] Tabela e índices conferidos no banco (`show index from follows`)

### Etapa 2 — Service, Controller e Rotas
- [x] Três arquivos do módulo `follow` (service, controller, routes) + validator, registrados no `app.js` antes do 404 e do `errorHandler`
- [x] `parseUserId` convertendo o id na borda (controller)
- [x] Três escritas (linha + dois contadores) numa só transação

### Etapa 3 — Feed Filtrado e `isFollowing` no Perfil
- [x] Feed filtrado (`getFollowingSongs`) com `Op.in`, paginado, devolvendo lista vazia para quem não segue ninguém
- [x] `isFollowing` no perfil público (só consultado quando há usuário logado que não é o dono)

### Etapa 4 — Testes
- [x] Os oito testes da Parte A executados com sucesso (`script-testes-parte-a.sh`)

## Frontend (Parte B)

### Alcançabilidade (ADR-012)
- [x] Respondida em `alcancabilidade.md`; o link "Seguindo" da Sidebar aponta para `/following`, que agora existe no `router/index.js`

### Etapas 1 a 4
- [x] `followService.js` criado
- [x] `FollowButton` com `defineModel`, otimista, com rollback e `isBusy`
- [x] Sem a leitura de `following.value` logo após atribuí-lo (usa a variável local `nowFollowing`)
- [x] Perfil público com o botão ativo, contador do cartão mudando junto
- [x] Números "Seguidores"/"Seguindo" do perfil viram links
- [x] Uma tela de lista (`FollowListView`), duas rotas, abas funcionando
- [x] Feed filtrado com rota e acessível pela Sidebar

### Etapa 5 — Teste prático (nove passos)
- [x] Visitante: botão aparece, clique leva ao login e volta ao perfil
- [x] Logado: "Seguir" muda botão e contador na hora; F5 mantém; "Seguindo" desfaz
- [x] Slow 4G: mudança instantânea; Offline: muda, volta atrás e mostra a mensagem de erro
- [x] O contador nunca vai para -1
- [x] No próprio perfil não há botão de seguir; os números são links
- [x] Abas Seguidores/Seguindo sem recarregar; clicar numa pessoa leva ao perfil; usuário inexistente mostra erro; lista vazia mostra mensagem
- [x] Trocar de uma pessoa que sigo para outra que não sigo: o botão reflete a pessoa nova
- [x] Feed filtrado pela Sidebar: só itens de quem sigo; ao deixar de seguir, os itens saem
- [x] Regressão: Perfil, Feed, Detalhe, Meus Itens, Curtidas, Login/Logout

## Prints (`01 - Docs/atividade11/`)
- [x] `seguindo.jpg`, `otimista.jpg`, `rollback.jpg`, `seguidores.jpg`, `feed-seguindo.jpg`, `follows.jpg`
- [x] Prints dos curls da Parte A (`curl-1` a `curl-8`)
- [x] `respostas.md`

## Entrega
- [x] Backend e frontend compactados sem `node_modules`

# Situação Geral (atualizada)

- [x] Atividade 11 concluída


---

# Atividade 12 - Checkpoint 2: Leitura Crítica, Constantes, useAsyncData, Toasts e Regressão

## Backend (Parte A)

### Etapa 1 — Leitura guiada
- [x] `checkpoint-02.md` criado, com as respostas dos Blocos 2.1 a 2.6 e as três perguntas extras

### Etapa 2 — Paginação
- [x] Problema reproduzido e anotado antes da correção (`paginacao-antes.jpg`)
- [x] `PAGINATION` e `utils/pagination.js` criados e usados nos dois controllers e nos dois services
- [x] Testes do Bloco 3.4 com o resultado esperado (`paginacao-depois.jpg`, `curl-1-paginacao.jpg`)

### Etapa 3 — Transação do registro + contador
- [x] `createSong` dentro de uma transação, com `{ transaction }` nas duas escritas
- [x] Criação testada: 201 e contador incrementado (`curl-2-criacao-transacao.jpg`)

### Etapa 4 — Regressão da API
- [x] Todas as chamadas respondem como esperado, sem regressão (`curl-3-regressao.jpg`, `curl-4-id-invalido.jpg`)

## Frontend (Parte B)

### Etapa 1 — Constantes
- [x] `constants.js` criado, com limites iguais aos da API
- [x] `api.js`, `stores/auth.js` e os services de feed usam as constantes

### Etapa 2 — Toasts e interceptor
- [x] Toasts funcionando, acima do modal (`toast-modal.jpg`)
- [x] `silent` apenas nos formulários; nenhum toast duplicado (`formulario-sem-toast.jpg`)

### Etapa 3 — `useAsyncData` e `usePaginatedList`
- [x] Todas as telas de leitura usam os composables, sem `apiErrorMessage` sobrando nelas
- [x] Cada tela testada individualmente (Feed, Feed filtrado, Detalhe, Perfil Público, Curtidas, Meus Itens, Listas de seguidores, Comentários)
- [x] Decisão registrada: **telas de formulário ficam de fora** (`RegisterView`, `UploadMusicView`, `EditSongView`, `MyProfileView`, `LoginView`). Elas não "leem para mostrar": o usuário digita, envia e recebe um resultado. O `isLoading`/erro delas pertence ao envio (e ao campo), não ao carregamento ao montar; forçar `useAsyncData` ali só esconderia o `try/catch` que o formulário precisa. (`apiErrorMessage` continua nelas, de propósito.)

### Etapa 4 — `useAuthenticatedAction`
- [x] `LikeButton` e `FollowButton` usam `useAuthenticatedAction` e não têm mais `errorMessage`
- [x] Três cliques rápidos com a rede lenta geram uma requisição (`uma-requisicao.jpg`)

### Etapa 5 — Constantes nos formulários
- [x] Nenhum limite solto nos formulários (Register, MyProfile, Upload, EditSong usam `LIMITS.*`)

### Etapa 6 — Regressão completa
- [x] Todos os passos realizados em conta nova (cadastro → login → upload → feed → curtir → seguir → comentar → excluir), sem regressão e sem erros vermelhos no Console além dos provocados (Offline e a senha errada)

## Reflexão (ADR-013)
- [x] Tabela de pendências no `checkpoint-02.md` (Seção 13)

## Entrega
- [x] `respostas.md` com as sete respostas
- [x] Prints em `01 - Docs/atividade12/`
- [x] Backend e frontend compactados sem `node_modules`

# Situação Geral (atualizada)

- [x] Atividade 12 concluída
- [x] Atividade 13 concluída
- [x] Atividade 14 concluída
- [x] Atividade 15 concluída

---

# Atividade 13 — Playlists (N:N), Salvar e Busca

## Parte A — API
- [x] Constantes de validação e de busca criadas; `parseId` criado e usado pelo `followController` (função antiga removida)
- [x] Dois models (`Playlist`, `PlaylistSong`) e seis associações; tabelas, índices e FKs `ON DELETE CASCADE` conferidos (`colecoes-banco.jpg`)
- [x] Quatro arquivos do módulo de playlist registrados no `app.js`; duas escritas (linha + contador) numa só transação nas três operações; 403 para privada de outra pessoa; `isOwner` correto (dona, outra pessoa, visitante)
- [x] Busca consultando o banco, com escape, `Promise.all` e `typeof req.query.q`; controller `async/await` e rota com `asyncHandler`
- [x] Exclusão da música limpa a junção e desconta o contador de cada playlist, na mesma transação; teste de controle feito e descrito (`contador-controle.jpg` / `contador-certo.jpg`, `respostas.md` pergunta 3)
- [x] Os onze testes da Etapa 6 executados com sucesso (um print por curl)

## Parte B — Frontend
### Checagem de alcançabilidade
| Peça | Caminho de clique |
|---|---|
| Minhas Playlists | menu do avatar (novo) e Sidebar "Playlists" (agora aponta para `/playlists`) |
| Criar / excluir | botão "Nova playlist" e "Excluir" na própria tela (modais) |
| Detalhe | clique no cartão da lista |
| Salvar | botão "Salvar" no detalhe da música (visitante → login → volta ao item) |
| Remover da playlist | botão em cada card, no detalhe (só a dona) |
| Busca | barra da Navbar (Enter) e "Explorar" da Sidebar |

- [x] Rotas conferidas no `router/index.js`: lista (`/playlists`), detalhe (`/playlists/:id`) e busca (`search`) existem; o detalhe é **público** (removido `requiresAuth`); o nome `search` é o mesmo do `router.push`; removida a rota placeholder `/playlists/create`; Sidebar ajustada ("Explorar" → busca, "Playlists" → `/playlists`)
- [x] Lacuna de escopo (conhecida, não resolvida): a playlist **pública de outra pessoa só é alcançável por link**; nenhuma tela lista as playlists públicas de alguém
- [x] Etapa 1: constantes (`LIMITS.PLAYLIST_*`, `SEARCH` com `DEBOUNCE_MS: 400`), service com as sete funções; a Home não chamava `search(...)`, nada a remover
- [x] Etapa 2: `runOptimistic` criado; `LikeButton` e `FollowButton` refatorados e sem regressão
- [x] Etapa 3: modal de criação, lista e detalhe, com 403/404 na própria tela; cartão clicável com botão "Excluir" por cima do link esticado
- [x] Etapa 4: modal "Salvar" (caixas `:checked` + `@change`, cadeado, cerca por linha, otimista com rollback) e botão "Salvar" no detalhe
- [x] Etapa 5: `useDebouncedValue`, `SearchView` (termo na URL, F5/link/Voltar), Navbar com busca e "Minhas Playlists" no menu
- [x] Etapa 6: passos 1 a 4 e 6 percorridos no navegador (Playwright, com Slow 4G/Offline) a partir do login; passo 5 (contador cai ao excluir música que está numa playlist) conferido na API (curl 8)
- [x] Uma só requisição `GET /search` ao digitar "samba" sem pausa (`debounce.jpg`)
- [x] Nenhum erro vermelho no Console além dos provocados (Offline)

## Entrega
- [x] `respostas.md` com as oito respostas
- [x] Prints em `01 - Docs/atividade13/`
- [x] Backend e frontend compactados sem `node_modules`

---

# Atividade 14 — Notificações e Denúncias

## Parte A — API
- [x] Constantes `NOTIFICATION` e `REPORT`, dois models (`Notification`, `Report`) e cinco associações (só `belongsTo`: `Recipient`, `Actor`, `Reporter` e o item em cada tabela)
- [x] Tabelas, índices, ENUM e chaves estrangeiras conferidos no banco (`reports`: NO ACTION; `notifications.song_id`: SET NULL) — `banco-notificacoes.jpg`
- [x] Módulo de notificações: quatro arquivos, registrados no `app.js`; `GET /notifications` sem token responde 401
- [x] Módulo de denúncias: quatro arquivos, registrados no `app.js`; ordem 401 → 400 (motivo) → 400 (id) → 404 → 400 (próprio item) → 409
- [x] As três ações criam o aviso dentro da transação, com o `t`; curtir e seguir também o apagam ao desfazer
- [x] Exclusão do item limpa denúncias e notificações, antes do destroy do item
- [x] `cors` antes do `express.json()` no `app.js`
- [x] Teste de controle feito e descrito (a: 500 de FK em `reports`; b: aviso órfão com `song_id` NULL) — `respostas.md` pergunta 6
- [x] Os onze testes da Etapa 5 executados com sucesso (um print por curl)

## Parte B — Frontend
### Checagem de alcançabilidade
| Peça | Caminho de clique |
|---|---|
| Notificações | sino na Navbar (só logado) → `/notifications` |
| Marcar como lida | botão na linha e clique no texto da notificação |
| Ir ao que gerou o aviso | clique no texto: item (curtir/comentar) ou perfil (seguir) |
| Mais antigas / novas | "Carregar mais notificações" / "Atualizar" |
| Denunciar | botão "Denunciar" no Detalhe (visitante → login → volta; o dono não o vê) |

- [x] Rota `notifications` existe no `router/index.js`, com `requiresAuth`, e tem o mesmo nome que a Navbar usa em `{ name: 'notifications' }`; a tela existia como placeholder e foi implementada
- [x] Lacuna de escopo (conhecida, não resolvida): a lista de notificações **não se atualiza sozinha**; só o número do sino (polling). Para ver novas, "Atualizar" ou reabrir a tela
- [x] Etapa 1: constantes (`NOTIFICATIONS.POLL_MS`, `NOTIFICATION_TEXT`, `REPORT_REASONS`), dois services e a store com as cinco funções; `removeEventListener` recebe a mesma referência do `addEventListener`
- [x] Etapa 2: sino só para quem está logado; selo só com não lidas (99+); número se atualiza sozinho; um só temporizador depois de logins/logouts repetidos; nenhuma requisição ao sair — `polling-network.jpg`
- [x] Etapa 3: lista paginada, estado vazio, "Atualizar", "Carregar mais"; marcar como lida otimista com rollback + toast, uma requisição por clique duplo e o sino certo mesmo com duas linhas falhando juntas (`utils/optimistic.js` não foi alterado)
- [x] Etapa 4: modal com cinco rádios, motivo obrigatório (sem requisição), erro dentro do modal e sem toast, toast de sucesso; o dono não vê "Denunciar"; logout com `undefined` e Console limpo
- [x] Etapa 5: os nove passos percorridos em sequência no navegador (Playwright); o experimento de `POLL_MS = 5000` foi substituído por simular a aba escondida/visível com `POLL_MS = 30000`; a corrida opcional (passo 7) não foi executada com o atraso temporário na API
- [x] Nenhum erro vermelho no Console além dos provocados (Offline e a sessão com token "lixo")

## Entrega
- [x] `respostas.md` com as dez respostas
- [x] Prints em `01 - Docs/atividade14/`
- [x] Backend e frontend compactados sem `node_modules`

---

# Atividade 15 — Painel de Administração

## Parte A — API
- [x] Constantes `REPORT.STATUS` e `ADMIN.REPORT_FILTERS`; model de denúncia com `status` (ENUM, padrão `pending`), `reviewedAt` e índice `idx_reports_status`
- [x] Banco com `status` e `reviewed_at`; denúncias antigas `pending` (`banco-denuncias.jpg`)
- [x] `isAuthenticated` assíncrono consultando o banco (inexistente → 401; bloqueado → 401; `req.user` do banco) e `isAdmin` (403) exportados; rotas antigas sem alteração
- [x] Login de bloqueado → 403 (depois da senha); senha errada continua com a mensagem genérica
- [x] `escapeLike` em `utils/` (busca pública continua tratando `%%` como texto); `scripts/setAdmin.js` promove e rebaixa (`off`) e avisa se o usuário não existe
- [x] Quatro arquivos em `modules/admin/` registrados no `app.js`; `GET /api/admin/dashboard` sem token → 401; a exclusão do painel reaproveita o `deleteSong` com `isAdmin = true`
- [x] Dois testes de controle feitos, desfeitos e descritos (`controle-bloqueio.jpg`, `controle-isadmin.jpg`)
- [x] Os nove testes da Etapa 5 executados com sucesso (um print por curl)

## Parte B — Frontend
### Checagem de alcançabilidade
| Peça | Caminho de clique |
|---|---|
| Painel | lateral → seção Administração (só administrador) → "Painel" (`/admin`, que redireciona para o Dashboard) |
| Denúncias | aba Denúncias e o cartão vermelho de pendentes do Dashboard |
| Usuários / Músicas | abas do painel |
| Revisar / Bloquear / Excluir | botões na linha (Bloquear e Excluir abrem confirmação; Desbloquear é direto) |
| Filtrar / buscar | grupo de botões (Denúncias); campo com debounce (Usuários e Músicas) |
| Ver a música / o perfil | miniatura ou título (Denúncias e Músicas); `@usuário` (Usuários) |

- [x] Conferido no `router/index.js`: as quatro rotas `admin-*` agora são filhas de `/admin` (com `redirect` e `requiresAuth` + `requiresAdmin` no pai); as quatro telas deixaram de ser placeholders; o link da lateral já apontava para `/admin`
- [x] Etapa 1: `REPORT_FILTERS`, `adminService` (sete chamadas, sem `silent`), `usePaginatedList` com `watch` e `lastCallId`, `ConfirmModal`; Feed, Seguindo, Notificações e Playlists continuam carregando mais
- [x] Etapa 2: `AdminLayout` com quatro abas, rotas aninhadas, guarda por papel (visitante → Login com `?redirect=`; comum → Feed com aviso)
- [x] Etapa 3: Dashboard (cartões + cartão de pendentes como link; erro 403 no lugar dos números) e Denúncias (filtro, motivo em português, revisar que espera a API)
- [x] Etapa 4: Usuários (busca com debounce, bloquear com confirmação, desbloquear direto) e Músicas (busca, selo de denúncias pendentes, exclusão com confirmação que descreve a consequência)
- [x] Etapa 5: os nove passos percorridos em sequência no navegador (Playwright, com Slow 3G/Offline). Dois desvios, por causa do projeto: (1) o `beforeEach` do projeto revalida o perfil a cada navegação, então o `isAdmin` editado no `localStorage` é desfeito no F5; o experimento foi reproduzido adulterando a resposta do `/profile/me` (resultado: 403 em todas as chamadas e "Acesso restrito"); (2) com o painel aberto e o administrador rebaixado, a próxima navegação já leva ao Feed com o aviso (em vez de mostrar "Acesso restrito" na aba), pelo mesmo motivo
- [x] **Limitação conhecida (não resolvida):** a paginação por offset **pula itens** quando a lista muda entre uma página e a seguinte (visto com `PAGE_SIZE = 2`, `pulo-paginacao.jpg`); o conserto (paginação por cursor) fica para a Aula 18
- [x] Nenhum erro vermelho no Console além dos provocados (Offline e a sessão com token "lixo"); `PAGE_SIZE` restaurado para 12

## Entrega
- [x] `respostas.md` com as dez respostas
- [x] Prints em `01 - Docs/atividade15/`
- [x] Backend e frontend compactados sem `node_modules`

