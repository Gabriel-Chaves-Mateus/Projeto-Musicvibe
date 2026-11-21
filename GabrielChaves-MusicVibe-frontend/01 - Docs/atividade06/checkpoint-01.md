# Checkpoint 1 — Revisão de Consistência do Back-end (MusicVibe API)

**Aluno:** Gabriel Chaves · **Atividade 06 — Parte A** · Nenhuma linha de código nova foi escrita no back-end.

Módulos revisados: `modules/search` (`searchRoutes`, `searchController`, `searchService`) e
`modules/user` (`userRoutes`, `userValidator`, `userController`, `userService`, `userModel`),
além de `middlewares/` e `config/constants.js`.

Padrão de camadas: **Route → Controller → Service → Model**.

---

### 1. Alguma rota contém lógica de negócio, em vez de só declarar verbo + caminho + middlewares + controller?

**Não.** `searchRoutes.js` e `userRoutes.js` só declaram verbo, caminho, middlewares
(`isAuthenticated`, `profileUpload.single`, validators, `asyncHandler`) e o controller.
Observação: `routes/index.js` (`GET /api`) tem um handler inline que apenas devolve o
status da API com `success()`. É uma rota de *health check* sem regra de negócio e sem Model,
então não quebra o padrão, mas é a única rota que não passa por um Controller.

### 2. Algum Controller consulta o Model diretamente, sem passar pelo Service?

**Não.** `userController` chama somente `userService`; `searchController` chama somente
`searchService`. O único arquivo que importa `userModel` é `userService.js`.

### 3. Algum Service faz referência a `req` / `res`?

**Não.** Os Services recebem dados puros (`userId`, `data`, `uploadedFile`, `email`, `password`…)
e devolvem objetos ou lançam `Error` com `status`. O `uploadedFile` é o objeto de arquivo já
extraído pelo Controller (`req.file`), e o Service não conhece o `req`.

### 4. Todo Controller usa `success()` / `error()` de `apiResponse.js`?

**Sim, com a divisão de papéis esperada.** Todos os Controllers respondem com `success()`.
Nenhum chama `error()` diretamente porque os erros são lançados (`throw`) e convertidos em
resposta padronizada pelo `errorHandler.js`, que usa `error()`. Assim, `success()` e `error()`
são os únicos pontos que montam o formato `{ success, message, data/errors }`.

### 5. Toda rota que chama uma função `async` está envolvida em `asyncHandler`?

**Sim.** As seis rotas de `userRoutes.js` (register, login, logout, `PUT/GET /profile/me` e
`GET /profile/:username`) usam `asyncHandler(...)`. `search` não está embrulhada porque
`searchController.search` e `searchService.globalSearch` são síncronos (ainda são um
*placeholder*). **Pendência para quando a busca ficar real:** se `globalSearch` virar `async`,
a rota passa a precisar do `asyncHandler`.

### 6. Toda validação de entrada usa `express-validator`, sem nenhum `if` manual escondido?

**Sim para validação de entrada.** Todos os campos de entrada são validados em `userValidator.js`
com `body(...)`. O único `if` ali está dentro de `.custom()` (confirmação de senha), que faz
parte da cadeia do `express-validator`. Os `if` encontrados em outros lugares não são validação
de entrada:
- `userService.js`: regras de negócio (usuário não encontrado → 404, e-mail/usuário já cadastrado,
  usuário bloqueado, remoção da foto antiga).
- `profileMulter.js`: filtro de tipo de arquivo, que é responsabilidade do Multer.
- `searchController.js`: `if (query)` escolhe se chama ou não o Service. É controle de fluxo, não
  validação, mas é o ponto mais próximo de "lógica no Controller". **Candidato a ajuste futuro:**
  mover essa decisão para o `searchService` quando a busca for implementada de verdade.

### 7. `config/constants.js` não tem constante solta sem uso, nem valor de validação fora dela?

**Sem constante solta:** `USERNAME_MIN`, `USERNAME_MAX`, `PASSWORD_MIN` e `BIO_MAX` são todas
usadas em `userValidator.js`.
**Valores literais fora do arquivo (a registrar, sem alterar nesta atividade):**
- `profileMulter.js`: limite de 5 MB e lista de MIME types permitidos, escritos direto no arquivo.
  Não são regras do `express-validator`, mas são limites de entrada e poderiam virar constantes.
- `userModel.js`: `DataTypes.STRING(255)` na coluna `bio` repete o número de `BIO_MAX`.
  É um tamanho de coluna do banco, mas se `BIO_MAX` mudar, a coluna precisa mudar junto.

### 8. A constante de limite da bio (Aula 05) é usada exatamente uma vez, no lugar certo?

**Sim, em um único lugar:** `profileUpdateValidator`, em `userValidator.js`. Aparece na regra
`isLength({ max })` e na mensagem de erro da mesma regra. Não é usada em Controller nem Service.
(No front-end o valor 255 aparece em `MyProfileView.vue`, mas isso é outra camada.)

---

## Conclusão

O padrão **Route → Controller → Service → Model** se manteve em todos os módulos desde a Aula 01.
Nenhuma violação de camada foi encontrada. Os pontos de atenção (itens 1, 5, 6 e 7) são
observações para as próximas aulas e não exigiram nenhuma mudança agora.
