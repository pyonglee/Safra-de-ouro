# 🌿 Safra de Ouro

**Aplicativo de controle financeiro para produtores rurais de lavoura de café.**

Gerencie safras, trabalhadores, balaios, despesas, produção e cotações do café — tudo em um só lugar, direto do celular.

---

## 📱 Sobre o projeto

O Safra de Ouro é um sistema completo composto por um **app mobile** (para o produtor usar no dia a dia) e um **servidor backend** (que processa e armazena todos os dados com segurança).

### Funcionalidades

- **Safras** — cadastro e acompanhamento de cada safra com datas e preço de venda por saca
- **Trabalhadores** — cadastro de funcionários da lavoura
- **Balaios** — registro diário de balaios por trabalhador com cálculo automático do valor a pagar
- **Produção** — controle de sacas produzidas por data
- **Despesas** — lançamento de gastos por categoria (insumos, mão de obra, etc.)
- **Cotações** — acompanhamento do preço do café por tipo
- **Dashboard** — visão geral financeira da safra
- **Relatórios** — resumo de resultados por período

---

## 🗂️ Estrutura do projeto

```
Safra-de-ouro/
├── nodejs_space/          # Servidor (backend)
│   ├── src/               # Código-fonte principal
│   │   ├── auth/          # Login e autenticação
│   │   ├── harvests/      # Safras
│   │   ├── workers/       # Trabalhadores
│   │   ├── balaio-records/# Registros de balaios
│   │   ├── production-records/ # Produção
│   │   ├── expenses/      # Despesas
│   │   ├── quotations/    # Cotações do café
│   │   ├── dashboard/     # Resumo financeiro
│   │   ├── reports/       # Relatórios
│   │   └── settings/      # Configurações do usuário
│   ├── prisma/            # Banco de dados
│   │   ├── schema.prisma  # Estrutura das tabelas
│   │   └── seed.ts        # Dados iniciais para teste
│   └── .env               # Variáveis de ambiente (não compartilhar!)
│
└── react_native_space/    # App mobile (frontend)
    ├── app/               # Telas do aplicativo
    │   ├── tabs/          # Abas do menu inferior
    │   ├── auth/          # Login e cadastro
    │   ├── add-harvest.tsx
    │   ├── add-expense.tsx
    │   ├── add-worker.tsx
    │   ├── add-balaio.tsx
    │   ├── cotacoes.tsx
    │   ├── relatorios.tsx
    │   └── perfil.tsx
    ├── src/
    │   ├── components/    # Componentes reutilizáveis
    │   ├── contexts/      # Estado global (usuário logado)
    │   ├── services/      # Comunicação com o servidor
    │   └── theme.ts       # Cores e estilos do app
    └── assets/            # Imagens e ícones
```

---

## 🛠️ Tecnologias utilizadas

### Backend (`nodejs_space`)
| Tecnologia | Função |
|---|---|
| Node.js + NestJS | Framework do servidor |
| TypeScript | Linguagem de programação |
| Prisma ORM | Comunicação com o banco de dados |
| PostgreSQL | Banco de dados |
| JWT + Passport | Autenticação e segurança |
| bcryptjs | Criptografia de senhas |

### App Mobile (`react_native_space`)
| Tecnologia | Função |
|---|---|
| React Native + Expo | Framework do app mobile |
| TypeScript | Linguagem de programação |
| Expo Router | Navegação entre telas |
| Axios | Comunicação com o servidor |
| React Native Paper | Componentes visuais |
| AsyncStorage | Armazenamento local no celular |

---

## ⚙️ Como rodar o projeto

### Pré-requisitos

Você precisará ter instalado na sua máquina:
- [Node.js](https://nodejs.org/) versão 18 ou superior
- [Yarn](https://yarnpkg.com/) gerenciador de pacotes
- [Expo Go](https://expo.dev/go) no celular (para testar o app)
- Banco de dados PostgreSQL (ou usar o já configurado no `.env`)

---

### 1. Rodar o servidor (backend)

```bash
# Entre na pasta do servidor
cd nodejs_space

# Instale as dependências
yarn install

# Configure as variáveis de ambiente
# Crie um arquivo .env com o conteúdo abaixo:
# JWT_SECRET="sua_chave_secreta_aqui"
# DATABASE_URL="sua_url_do_banco_aqui"

# Rode as migrações do banco de dados
yarn prisma migrate deploy

# (Opcional) Popule o banco com dados de exemplo
yarn prisma db seed

# Inicie o servidor em modo desenvolvimento
yarn start:dev
```

O servidor ficará disponível em: `http://localhost:3000`

---

### 2. Rodar o app mobile (frontend)

```bash
# Em outro terminal, entre na pasta do app
cd react_native_space

# Instale as dependências
yarn install

# Inicie o app
yarn start
```

Após iniciar, escaneie o QR Code com o aplicativo **Expo Go** no seu celular.

---

## 🗄️ Banco de dados

O projeto utiliza **PostgreSQL** com as seguintes tabelas:

| Tabela | Descrição |
|---|---|
| `users` | Produtores cadastrados |
| `settings` | Configurações do produtor (ex: preço por balaio) |
| `harvests` | Safras cadastradas |
| `workers` | Trabalhadores da lavoura |
| `balaio_records` | Registros de balaios por trabalhador |
| `production_records` | Registros de sacas produzidas |
| `expenses` | Despesas por safra e categoria |
| `quotations` | Cotações do preço do café |

---

## 🔐 Variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `nodejs_space/` com as seguintes variáveis:

```env
# Chave secreta para geração de tokens de login (escolha uma string aleatória longa)
JWT_SECRET="sua_chave_secreta_aqui"

# URL de conexão com o banco de dados PostgreSQL
DATABASE_URL="postgresql://usuario:senha@host:5432/nome_do_banco"
```

> ⚠️ **Nunca compartilhe o arquivo `.env` publicamente.** Ele contém senhas e credenciais de acesso.

---

## 📲 Telas do aplicativo

| Tela | Descrição |
|---|---|
| Login / Cadastro | Acesso seguro com e-mail e senha |
| Dashboard | Resumo financeiro da safra atual |
| Despesas | Lista e cadastro de gastos |
| Produção | Registro de sacas por data |
| Trabalhadores | Cadastro e listagem de funcionários |
| Balaios | Lançamento diário de balaios |
| Cotações | Acompanhamento do preço do café |
| Relatórios | Análise financeira por safra |
| Perfil | Dados e configurações do produtor |

---

## 🚀 Build para produção

### Servidor
```bash
cd nodejs_space
yarn build
yarn start:prod
```

### App mobile (gerar APK/IPA)
```bash
cd react_native_space
# Instale o EAS CLI se ainda não tiver
npm install -g eas-cli

# Faça login na sua conta Expo
eas login

# Gere o build
eas build --platform android   # Para Android
eas build --platform ios       # Para iOS
```

---

## 📄 Documentação adicional

- `api_design.md` — Documentação de todas as rotas da API
- `db_design.md` — Documentação da estrutura do banco de dados
- `ux_design.md` — Documentação do design e fluxo de telas

---

## 📜 Licença

Projeto privado. Todos os direitos reservados.
