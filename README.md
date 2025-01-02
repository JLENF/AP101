# AP101 - Sistema de Gestão de Locações

![AP101 Logo](./public/ap101-icon.svg)

AP101 é um sistema moderno e intuitivo para gestão de locações de imóveis, desenvolvido com React, TypeScript e Supabase.

## 🏠 Sobre o Projeto

O AP101 foi projetado para simplificar o gerenciamento de locações, oferecendo uma interface amigável e recursos essenciais para proprietários e administradores de imóveis.

### Principais Funcionalidades

- 📅 Calendário de locações com visualização intuitiva
- 💰 Controle de pagamentos
- 👥 Gestão de inquilinos
- 🎨 Sistema de cores para identificação visual de locações
- 📊 Relatórios e análises
- 🔐 Sistema seguro de autenticação

## 🚀 Tecnologias Utilizadas

- **Frontend:**
  - React
  - TypeScript
  - TailwindCSS
  - Lucide Icons
  - React Hot Toast

- **Backend:**
  - Supabase (Banco de dados PostgreSQL)
  - Row Level Security (RLS)
  - Autenticação e Autorização

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Conta no Supabase

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/JLENF/AP101.git
cd AP101
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione as seguintes variáveis:
```env
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

4. Configure o banco de dados:
   - No Supabase, execute o script SQL localizado em `supabase/init.sql`
   - Este script criará todas as tabelas e políticas de segurança necessárias

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

6. Docker:
```bash
docker compose up -d --build
```

7. Acesse o projeto em http://localhost

## 📚 Estrutura do Projeto

```
ap101/
├── public/
│   └── ap101-icon.svg
├── src/
│   ├── components/     # Componentes React
│   ├── contexts/       # Contextos React
│   ├── lib/           # Configurações de bibliotecas
│   ├── types/         # Tipos TypeScript
│   └── utils/         # Funções utilitárias
├── supabase/
│   └── init.sql       # Script de inicialização do banco
└── package.json
```

## 🔒 Segurança

- Autenticação gerenciada pelo Supabase
- Row Level Security (RLS) implementado em todas as tabelas
- Políticas de acesso granular por usuário
- Proteção contra SQL injection

## 🎨 Personalização de Cores

O sistema utiliza um esquema de cores predefinido para as locações:
- Azul
- Verde
- Rosa
- Roxo
- Índigo
- Laranja
- Amarelo

As cores são atribuídas automaticamente e salvas nas preferências do usuário.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Suporte

Para suporte, abra uma issue aqui no GitHub.
