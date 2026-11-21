# Checklist de Alcançabilidade — Atividade 07

**Tela nova:** Enviar Música (`/upload`, `UploadMusicView.vue`).

| Pergunta | Resposta |
|---|---|
| A tela é alcançável por um clique, sem digitar a URL? | **Sim.** Há o link "Enviar Música" (ícone `bi-cloud-upload`) na **Navbar** e na **Sidebar**. |
| O link aparece só para quem pode usar a tela? | **Sim.** Navbar e Sidebar usam `isAuthenticated` do `useAuth()`. Deslogado, nenhum dos dois links aparece. |
| E se o usuário deslogado digitar `/upload`? | A rota tem `meta.requiresAuth`. O guarda redireciona para `/login?redirect=/upload`. |
| A navegação recarrega a página? | **Não.** O link é um `<router-link>` (SPA): só a URL muda. |
| O link aponta para algo que já existe? | **Sim.** O formulário e a rota `POST /api/songs` estão funcionando de ponta a ponta. |
| Alguma outra tela ainda só é alcançável por URL? | Os links de Favoritos, Playlists e Seguindo continuam fora da Sidebar de propósito. Essas telas ainda são "Em construção" e voltam quando cada funcionalidade existir. |

**Observação:** Perfil Público, Detalhe de Música, Admin etc. também ainda não têm link, porque dependem de funcionalidades futuras.
