# Checagem de Alcançabilidade (ADR-012) — Atividade 11

| Peça | Caminho(s) de clique construído(s) |
|---|---|
| Seguir / deixar de seguir | Qualquer perfil público de outra pessoa (clique no autor de um card, ou `/profile/:username`) → botão **Seguir/Seguindo**. Visitante: botão → `/login?redirect=/profile/:username` → entra → volta ao perfil. |
| Listas de seguidores/seguindo | Perfil público → os números **"N seguidores"** e **"N seguindo"** (agora `router-link`) → `/profile/:username/followers` ou `/following`; as **abas** alternam entre as duas listas; o link **"Voltar ao perfil"** volta; clicar numa pessoa abre o perfil dela. |
| Feed filtrado | Um clique a partir de qualquer tela logada: item **"Seguindo"** da Sidebar → `/following`. |

## Verificação do link da Sidebar

O `TheSidebar.vue` **não tinha** o item "Seguindo" (foi retirado enquanto a tela era só "Em construção"), mas o `router/index.js` já tinha a rota `/following` (`FollowingFeedView`, placeholder).
Ajuste feito: recoloquei o item **Seguindo** (`to="/following"`) na Sidebar e substituí o placeholder da tela pelo feed real; a rota continua `requiresAuth`. Os dois lados agora apontam para o mesmo path.

Observação: as rotas antigas `/following-artists` e `/favorites` seguem como "Em construção" e continuam fora da Sidebar (não fazem parte desta atividade).
