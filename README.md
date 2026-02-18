# 🍔 MobiFood API & Front-end

![Status](https://img.shields.io/badge/Status-Em%20Constru%C3%A7%C3%A3o-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

Uma solução completa de delivery desenvolvida para fins de estudo, explorando o desenvolvimento fullstack moderno. O projeto simula o ecossistema de uma plataforma de food service, com foco em performance, experiência do usuário (UX) e uma arquitetura de dados sólida.

## 🚀 Sobre o Projeto

Este repositório faz parte de um estudo aprofundado sobre o ecossistema JavaScript/TypeScript. O objetivo é construir uma aplicação de delivery robusta, focando em desafios reais como gerenciamento de múltiplos métodos de pagamento, estados complexos no front-end e modelagem de dados eficiente.

### 🛠 Tecnologias Utilizadas

**Front-end:**
* [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* [Tailwind CSS](https://tailwindcss.com/) (Estilização Utilitária)
* [TypeScript](https://www.typescriptlang.org/)

**Back-end:**
* [Node.js](https://nodejs.org/)
* [Prisma ORM](https://www.prisma.io/) (Modelagem e Banco de Dados)
* [PostgreSQL](https://www.postgresql.org/)

---

## 🏗️ Arquitetura e Decisões Técnicas

Durante o desenvolvimento, foram tomadas decisões importantes para otimizar a aplicação:

### 1. Modelagem de Pagamentos (Single Table Inheritance)
Inicialmente, os detalhes de pagamento estavam divididos em múltiplas tabelas. Para simplificar as consultas e melhorar a performance, migramos para uma estrutura de **Tabela Única**, onde campos específicos de PIX e Cartão coexistem, mas são validados via regra de negócio no back-end.



### 2. Normalização de Resposta da API
A API foi projetada para limpar dados nulos automaticamente antes de enviá-los ao front-end, garantindo um payload leve e um consumo mais simples pelos componentes React.

---

## 🎨 Funcionalidades em Destaque

- [x] **Gestão de Pagamentos:** Cadastro dinâmico de chaves PIX e cartões de crédito/débito.
- [x] **UI Responsiva:** Interface adaptável construída com Tailwind CSS.
- [ ] **Fluxo de Checkout:** (Em desenvolvimento)
- [ ] **Acompanhamento de Pedidos:** (Planejado)

---

## 💻 Como Rodar o Projeto

### Pré-requisitos
* Node.js instalado
* Instância de banco de dados (PostgreSQL)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/CleytonSouza1305/MobiFood-Front.git](https://github.com/CleytonSouza1305/MobiFood-Front.git)

2. **Instale as dependências:**
  ```bash
  Instale as dependências:

3. **Configure as variáveis de ambiente:**
  Crie um arquivo .env na raiz da pasta da API e adicione sua string de conexão:
  DATABASE_URL="postgresql://user:password@localhost:5432/mobifood"

4. **Rode as migrations do Prisma:**
  npx prisma migrate dev

5. **Inicie o projeto:**
  npm run dev