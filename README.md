# 🎵 MusicVibe

Plataforma web full-stack de streaming e compartilhamento de músicas independentes, desenvolvida com foco em interação social, desempenho e arquitetura modular.

---

## 🚀 Sobre o Projeto

O **MusicVibe** permite que artistas publiquem suas faixas e que ouvintes descubram novos sons, interajam com a comunidade e organizem suas próprias coleções. O sistema é dividido em uma **API RESTful** modular e uma **Single Page Application (SPA)** reativa.

### ✨ Principais Funcionalidades

* **Autenticação e Perfis:** Cadastro e login com autenticação via **JWT**, edição de perfil e upload de avatar.
* **Gestão de Músicas:** Upload de arquivos de áudio (`.wav`) e imagens de capa (`.jpg`), com edição e exclusão segura de mídia.
* **Feeds e Descoberta:** Feed geral paginado, feed exclusivo de artistas seguidos e busca em tempo real com *debounce*.
* **Interação Social:** Sistema de curtidas, comentários nas faixas, mecanismo de seguir/deixar de seguir usuários e atualizações otimistas na interface (*Optimistic UI*).
* **Playlists:** Criação de playlists públicas ou privadas e gerenciamento de faixas.
* **Notificações:** Central de notificações para curtidas, comentários e novos seguidores com atualização periódica.
* **Moderação e Painel Administrativo:** Sistema de denúncias de conteúdo e dashboard administrativo para gestão de usuários, músicas e relatórios.

---

## 🛠️ Tecnologias Utilizadas

### Backend (API)
* **Node.js** & **Express**
* **Sequelize ORM** (Modelagem relacional e associações)
* **JWT (JSON Web Token)** para autenticação e controle de acesso
* **Multer** para upload e armazenamento de áudios e imagens

### Frontend (SPA)
* **Vue 3** (Composition API)
* **Vite**
* **Vue Router** (Navegação e guardas de rota)
* **Stores & Composables** customizados (Paginação, Debounce, Toasts e UI Otimista)

---

## 🏗️ Arquitetura do Projeto

```text
├── backend/
│   ├── config/        # Configuração de banco de dados, JWT e associações
│   ├── middlewares/   # Autenticação, tratamento de erros e upload (Multer)
│   ├── modules/       # Arquitetura modular (Routes, Validators, Controllers, Services, Models)
│   ├── public/        # Armazenamento estático de uploads
│   └── scripts/       # Utilitários administrativos (ex: promoção de admin)
│
└── frontend/
    └── src/
        ├── components/  # Componentes reutilizáveis (Cards, Modais, Botões sociais)
        ├── composables/ # Lógica compartilhada (Paginação, Debounce, Auth)
        ├── router/      # Definição de rotas e proteção de acesso
        ├── services/    # Camada de comunicação HTTP com a API
        ├── stores/      # Gerenciamento de estado global (Sessão e Notificações)
        └── views/       # Páginas da aplicação (Feed, Perfil, Playlists, Admin)
```

---

## ⚙️ Como Executar Localmente

### Pré-requisitos
* **Node.js** instalado
* Banco de dados configurado conforme o arquivo `.env` do backend

### 1. Rodando o Backend
```bash
# Acesse a pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente no arquivo .env
# Inicie o servidor
npm start
```

### 2. Rodando o Frontend
```bash
# Em outro terminal, acesse a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Confira se a URL da API no .env aponta para a porta do backend
# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos e de portfólio por **Gabriel Chaves Mateus**.