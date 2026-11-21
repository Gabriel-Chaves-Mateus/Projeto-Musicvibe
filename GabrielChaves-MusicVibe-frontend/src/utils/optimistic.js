// O miolo da atualização otimista, extraído no TERCEIRO caso (curtir, seguir e
// marcar playlist): "mudar a tela já, confirmar com a API ou desfazer".
//
//   apply()    muda a tela AGORA e DEVOLVE a função que desfaz (undo). Quem sabe
//              o estado anterior é o apply, por isso é ele quem fabrica o undo.
//   request()  devolve a promessa da API.
//   confirm(d) recebe response.data e acerta a tela com a verdade do servidor.
//
// No erro só chama undo(): sem if, sem toast (o interceptor do Axios já avisou).
// O que muda entre os três casos é o apply/request/confirm; o esqueleto é este.
export async function runOptimistic({ apply, request, confirm }) {
  const undo = apply();

  try {
    const response = await request();
    confirm(response.data);
  } catch {
    undo();
  }
}
