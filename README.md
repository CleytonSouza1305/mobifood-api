# 🍔 MobiFood API & Front-end

![Status](https://img.shields.io/badge/Status-Em%20Constru%C3%A7%C3%A3o-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

Uma solução completa de delivery desenvolvida para fins de estudo, explorando o desenvolvimento fullstack moderno. O projeto simula o ecossistema de uma plataforma de food service, com foco em performance, experiência do usuário (UX) e uma arquitetura de dados sólida.

## 🚀 Sobre o Projeto

O MobiFood é uma plataforma full-stack de delivery em constante evolução, desenvolvida para explorar cenários complexos de e-commerce e logística. O projeto vai além do CRUD básico, implementando regras de negócio críticas baseadas em um modelo de dados relacional robusto.

### 🏗️ Arquitetura de Dados & Desafios Técnicos

A estrutura foi modelada no PostgreSQL via Prisma para suportar um ecossistema completo de food service:

Gestão Híbrida de Pagamentos: Implementação de uma estrutura flexível para PaymentMethods que suporta fluxos distintos para PIX (com chaves dinâmicas) e Cartões (com metadados de bandeira e validade) em uma única entidade otimizada.

Logística e Entregas (Courier System): O sistema conta com uma entidade Courier que gerencia o status do entregador em tempo real (AVAILABLE, DELIVERING), rastreamento via coordenadas geográficas (lat, lon) e um sistema de pontuação/score.

Motor de Cupons e Descontos: Lógica de aplicação de descontos (FIXED, PERCENTAGE, DELIVERY) com controle de validade e limites de uso por usuário (UsageCoupon).

Fluxo de Pedido (Order Lifecycle): Gerenciamento de ciclo de vida completo, desde o Cart (carrinho) e CartItem até a conversão em Order com múltiplos status (de PLACED a DELIVERED).

Experiência Personalizada: Sistema de temas (FavoriteTheme), múltiplos endereços por usuário com categorias (Casa, Trabalho) e sistema de avaliações com ratings para restaurantes.

### 🛠 Tecnologias Utilizadas

**Front-end:**
* [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* [Tailwind CSS](https://tailwindcss.com/) (Estilização Utilitária)

**Back-end:**
* [Node.js](https://nodejs.org/)
* [Prisma ORM](https://www.prisma.io/) (Modelagem e Banco de Dados)
* [PostgreSQL](https://www.postgresql.org/)
* [TypeScript](https://www.typescriptlang.org/)

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