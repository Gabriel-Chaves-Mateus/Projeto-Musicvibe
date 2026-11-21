# Respostas — Atividade 09 (MusicVibe)

**1. 401, 403 e 404, e por que "existe?" vem antes de "é seu?".**
`401` significa "não sei quem você é" (sem token ou token inválido). `403` significa "sei quem você é, mas você não pode fazer isso", como tentar editar a música de outra pessoa. `404` significa "isso não existe". No `findOwnedSong` do `songService` eu busco a música primeiro: se não existir, devolvo 404, e só depois comparo `song.userId` com o usuário logado para devolver 403. Se a ordem fosse invertida, não haveria dono para comparar quando o id não existe. Além disso, um 403 para um id inexistente seria uma resposta enganosa.

**2. Por que o banco é atualizado antes do disco.**
No `updateSong` eu faço `song.save()` e só depois apago a capa antiga com `deleteSongFile`. O mesmo vale no `deleteSong`: a transação (`destroy` e decremento do `songsCount`) é concluída antes de apagar áudio e capa. Se o banco falhar, os arquivos continuam no disco e nada ficou inconsistente. Na ordem inversa, eu apagaria o arquivo e o `save()` falharia, deixando um registro que aponta para um arquivo que não existe, com capa quebrada no Feed. Um arquivo sobrando no disco é um problema pequeno, enquanto um registro quebrado aparece para o usuário.

**3. O que é arquivo órfão, exemplos e onde a limpeza acontece.**
É um arquivo que está no disco mas nenhum registro do banco aponta mais para ele. Exemplo 1: o Multer grava a capa nova em `public/uploads/songs/covers`, mas o PUT falha com 403 (a música é de outra pessoa) ou com 400 (título vazio). Exemplo 2: a capa antiga de uma música depois que o usuário troca por outra, e o áudio e a capa de uma música excluída. A limpeza dos arquivos de requisições que falharam fica no `errorHandler.js`, que chama `removeUploadedFiles(req)`. A limpeza da capa trocada e dos arquivos de uma música excluída fica no `songService` (`deleteSongFile`), depois que o banco foi atualizado.

**4. Por que o botão de excluir não pode ficar dentro de um `<a>` e o modal não pode ficar dentro do card.**
Em HTML, um elemento interativo (botão, outro link) não pode ficar dentro de um `<a>`, e na prática clicar em "Excluir" também acionaria o link do card e levaria ao detalhe. Por isso o `SongCard` deixou de ser um `<a>` gigante: só a capa, o título e o autor são links, e o botão fica no slot `actions`. Já o modal fica na tela (`MySongsView`), com `Teleport` para o `<body>`, e não dentro de cada card. Dentro do card ele herdaria o tamanho, o `transform` do hover e o `overflow` do card, ficando cortado ou mal posicionado, e haveria um modal por card em vez de um só.

**5. Por que esconder o botão "Editar" não é segurança.**
O botão escondido é só conveniência de interface. Qualquer pessoa pode digitar a URL `/songs/:id/edit` ou chamar a API direto com curl ou Postman, sem passar pela tela. A proteção de verdade está na API: `findOwnedSong` confere o dono em `GET /edit`, `PUT` e `DELETE` e devolve 403 para quem não é o dono. A tela do front só mostra a mensagem de erro que vem da API.
