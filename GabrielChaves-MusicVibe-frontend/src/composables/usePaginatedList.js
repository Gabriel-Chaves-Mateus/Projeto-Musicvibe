import { ref, watch as vueWatch } from 'vue';

import { PAGE_SIZE, MESSAGES } from '../config/constants';

// Lista com "Carregar mais": acumula as páginas em items e controla hasMore.
//   const { items, hasMore, isLoading, isLoadingMore, error, loadMore } =
//     usePaginatedList((page, limit) => getFeed(page, limit), { itemsKey: 'songs' });
// Opção watch: uma fonte reativa (filtro, termo de busca) que, ao mudar, recarrega
// a lista desde a primeira página. A receita lê o valor atual da fonte ao ser chamada.
export function usePaginatedList(
  fetchPage,
  { pageSize = PAGE_SIZE, itemsKey = 'songs', watch: source = null } = {}
) {
  const items = ref([]);
  const page = ref(0);
  const hasMore = ref(false);
  const error = ref('');
  const isLoading = ref(false);      // primeira página
  const isLoadingMore = ref(false);  // páginas seguintes

  // Cada chamada (primeira página OU "carregar mais") recebe um número; só a mais recente
  // pode gravar resultado ou mexer nos indicadores. Trocar o filtro com um "carregar mais"
  // em voo descarta a resposta velha em vez de misturá-la com a lista nova.
  let lastCallId = 0;

  async function load(pageNumber) {
    const callId = ++lastCallId;
    const first = pageNumber === 1;

    (first ? isLoading : isLoadingMore).value = true;
    error.value = '';

    try {
      const response = await fetchPage(pageNumber, pageSize);

      if (callId !== lastCallId) return;

      const feed = response.data;
      items.value = first ? feed[itemsKey] : [...items.value, ...feed[itemsKey]];
      page.value = feed.page;
      hasMore.value = feed.hasMore;
    } catch (err) {
      if (callId !== lastCallId) return;
      error.value = err?.message || MESSAGES.GENERIC_ERROR;
    } finally {
      if (callId === lastCallId) {
        isLoading.value = false;
        isLoadingMore.value = false;
      }
    }
  }

  const reload = () => load(1);
  const loadMore = () => load(page.value + 1);

  reload();

  if (source) vueWatch(source, reload);

  return { items, hasMore, error, isLoading, isLoadingMore, loadMore, reload };
}
