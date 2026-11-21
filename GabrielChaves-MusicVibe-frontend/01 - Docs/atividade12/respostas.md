# Respostas — Atividade 12 (Checkpoint 2)

**1. Por que `useAsyncData` recebe `() => minhaChamada()` e não `minhaChamada()`.**
Escrever `useAsyncData(minhaChamada())` executa a chamada **antes** de o composable existir e entrega a ele só o resultado (uma Promise já em andamento). O composable não saberia disparar de novo quando o parâmetro da rota mudar, nem no "tentar novamente". Passando uma **função**, ele decide quando chamar: ao montar, a cada mudança do `watch` e no `execute()` manual. A função só roda quando o composable quiser.

**2. O que é a corrida entre respostas, como se manifesta e como o `lastCallId` a evita.**
É quando duas requisições seguidas terminam fora de ordem: o usuário abre a música 1, troca para a 2, e a resposta da 1 (mais lenta) chega depois da da 2. Sem proteção, a tela mostra a música 1 sob o link da 2: dados da pessoa/música errada. Cada chamada ganha um número (`++lastCallId`); depois do `await`, só a chamada cujo número ainda é o último (`callId === lastCallId`) pode gravar `data`, `error` e `isLoading`. As respostas atrasadas são descartadas.

**3. Quem avisa o usuário quando uma ação, uma leitura ou um formulário falha, e por que "toast para todo erro" seria erro de design.**
**Ação** (curtir, seguir, excluir: POST/PUT/DELETE sem `silent`): o interceptor do Axios mostra um **toast**, porque o usuário clicou num botão e não há onde mais escrever o erro. **Leitura** (GET): a **tela** mostra o erro (`error` do `useAsyncData`) no lugar onde os dados apareceriam. **Formulário**: o **próprio formulário** mostra a mensagem junto aos campos (`silent: true` desliga o toast). **401** leva ao login, sem toast. Toast para todo erro duplicaria o aviso (toast + mensagem da tela), exibiria erro de validação longe do campo a corrigir e desapareceria em segundos, enquanto a pessoa ainda precisa ler o que corrigir.

**4. Por que a lista de toasts fica fora de `useToast()` (singleton) e a vantagem sobre uma store Pinia.**
Se o `ref` fosse criado dentro da função, cada chamada a `useToast()` receberia uma lista nova e o interceptor e o `ToastContainer` falariam de listas diferentes. Declarada no módulo, a lista é criada **uma vez** e todos compartilham a mesma. A vantagem sobre o Pinia: o interceptor do Axios **não é um componente** e roda fora do contexto do Vue; chamar `useStore()` ali exigiria o Pinia ativo/instalado e fica frágil. O `ref` de módulo não depende de nada e basta para um estado tão pequeno.

**5. Por que `?limit=-3` era um problema, por que `Number.parseInt('abc') >= 1` dá `false` (e a utilidade), e por que existe um teto.**
Valores inválidos precisam virar um valor seguro: `limit=-3` faz `offset = (page-1) * limit` negativo e pode gerar SQL inválido (`LIMIT -3`), erro 500 ou resposta inconsistente. `Number.parseInt('abc')` é `NaN`, e **qualquer comparação com `NaN` é `false`**: então `NaN >= 1` cai no "senão" (valor padrão), assim como zero, negativo e vazio: um único `>= 1` trata texto, vazio, zero e negativo sem `if` separado (e tem que ser `>= 1`, não `> 1`, senão `limit=1` viraria o padrão). O **teto** (`MAX_LIMIT: 50`) impede `?limit=100000`, que faria o banco montar e enviar a tabela inteira de uma vez.

**6. Por que o miolo da atualização otimista não foi extraído hoje, e a "regra dos três".**
O miolo (guardar o estado anterior, aplicar já, confirmar com a API ou desfazer) existe em **dois** botões (curtir e seguir), e os dois diferem em detalhes (props x `defineModel`, contador do pai). Extrair com duas ocorrências seria adivinhar a abstração. A **regra dos três**: só se extrai uma repetição na **terceira** ocorrência, quando já dá para ver o que é igual e o que varia, e a abstração sai certa. Hoje só foi extraída a parte que já era idêntica nos dois (a "cerca": visitante → login e `isBusy`), no `useAuthenticatedAction`.

**7. O que pode dar errado quando um Service grava o registro e o contador do autor sem transação.**
As duas escritas são operações separadas no banco. Se a segunda falhar (queda de conexão, erro, servidor reiniciado), o registro existe mas o contador **não subiu** (ou o contrário): o `songsCount` do autor fica diferente do número real de músicas, e **nada corrige isso sozinho**. Com `sequelize.transaction`, as duas escritas valem juntas ou nenhuma vale (rollback), e uma requisição concorrente nunca vê o estado pela metade. No `createSong` as duas escritas ficam na mesma transação, e a criação foi testada: 201 e `songs_count` do autor subiu em 1.

