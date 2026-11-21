# Ficha de Preparação — MusicVibe (atualizada na Atividade 07)

| Dado | Valor |
|---|---|
| Nome do projeto | MusicVibe |
| Pasta da API | musicvibe-api |
| Pasta do frontend | musicvibe-frontend |
| Porta da API | 3000 |
| Entidade principal | música |
| Nome do campo de busca da entidade principal | songs |
| Nome do banco de dados MySQL do projeto | musicvibe_db |
| Nome do campo de contagem de itens publicados | songsCount |
| Cor de marca do projeto | #7C3AED |
| **Nome do model da entidade principal** | `Song` |
| **Nome da tabela** | `songs` |
| **Grupo** | **A** (dois arquivos: áudio + capa) |
| **Nome do campo do arquivo principal** | `audio` |
| **Nome do campo da capa** | `cover` |
| **Coluna de contagem no User incrementada** | `songsCount` |

**Por que Grupo A:** a funcionalidade "Upload de música" tem um arquivo de conteúdo (o áudio) e uma imagem de capa separada.
Por isso a rota usa `multer.fields([{ name: 'audio' }, { name: 'cover' }])`.
