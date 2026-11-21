# Respostas — Atividade 10 (MusicVibe)

**1. Por que "uma pessoa só curte uma vez" deve estar no banco.**
Se a regra existisse só no código (`if (jaCurtiu) ...`), ela dependeria de cada caminho de código lembrar de conferir, e duas requisições simultâneas (duplo clique, duas abas) poderiam passar na verificação ao mesmo tempo e criar duas linhas. O índice único composto `idx_unique_user_song_like` em `(user_id, song_id)` na tabela `likes` é a garantia final: o banco recusa a linha repetida com `Duplicate entry`, independente de bug no código. Testei inserindo uma curtida repetida à mão e o MySQL recusou.

**2. Contador guardado × contador calculado.**
O contador calculado é um `COUNT(*)` feito na hora: sempre correto, mas mais lento a cada leitura (e o Feed lê muitos). O guardado é uma coluna (`likesCount`, `commentsCount` em `songs`) lida direto, que é rápido, mas pode ficar errado se alguém criar a curtida e falhar antes de atualizar o contador (ou o contrário), deixando linha e número divergentes. A transação elimina esse risco: a linha de `Like` e o `increment` da coluna acontecem juntos ou nenhum dos dois acontece, então os dois sempre concordam.

**3. O que acontece se um comando dentro de `sequelize.transaction` esquecer `{ transaction: t }`.**
Esse comando não participa da transação: o Sequelize o executa numa conexão separada, fora dela. Se a transação der `rollback`, a escrita esquecida continua gravada (por exemplo, o contador sobe mas a curtida é desfeita). Um `findOne` sem `transaction` também não enxerga o que a transação ainda não confirmou. Por isso passei `{ transaction }` em todos os comandos do `toggleLike`, do `createComment` e do `deleteSong`.

**4. Atualização otimista: três passos e quando não usar.**
Os passos são: (1) guardar o estado anterior (`previousLiked`, `previousCount`); (2) aplicar a mudança na tela na hora, sem esperar a API; (3) chamar a API e, se der certo, usar a resposta do servidor como verdade, e se falhar, fazer o rollback voltando ao estado guardado e mostrar o erro. O `LikeButton` faz exatamente isso, com `isBusy` para impedir dois cliques simultâneos. Não vale usar quando a operação costuma falhar, quando o resultado depende de regra do servidor que o front não sabe prever (pagamento, estoque, cobrança) ou quando uma falha enganosa causaria dano, porque aí mostrar sucesso antes da confirmação seria arriscado.

**5. Por que o comentário sai com `{{ }}` e nunca com `v-html`.**
O texto do comentário vem de qualquer pessoa. O `{{ }}` o trata como texto puro: `<b>teste</b>` aparece escrito na tela e `<img onerror=...>` não vira imagem. O `v-html` insere o texto como HTML de verdade, então um comentário com `<img src=x onerror="...">` executaria JavaScript no navegador de quem abre a página, o que é um ataque de XSS. As quebras de linha foram preservadas com CSS (`white-space: pre-wrap`), sem precisar de HTML.

**6. Por que `.trim()` vem antes de `.notEmpty()`.**
Os validadores rodam na ordem em que são declarados, e o `trim()` também é um sanitizador que altera o valor. Se `notEmpty()` vier primeiro, `"     "` (só espaços) tem tamanho maior que zero e passa, e só depois é aparado para vazio e gravado. Com `trim()` primeiro, `"     "` vira `""` e `notEmpty()` recusa com 400. Por isso corrigi os validadores antigos (`username` e `fullName` no cadastro) e criei o do comentário já com `trim()` no início.
