# RotaSmart

Plataforma de gestão logística para otimização de rotas de entrega usando Inteligência Artificial.

## 📋 Visão Geral

RotaSmart é uma aplicação web que transforma dados de pedidos em rotas otimizadas, utilizando a API Gemini do Google para extração de dados e otimização de sequência de entrega.

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Adicionar sua API Key do Gemini
# Obtenha em: https://aistudio.google.com/app/apikey

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes React
├── services/      # API e armazenamento
├── types/         # TypeScript interfaces
├── utils/         # Funções utilitárias
└── lib/           # Utilitários compartilhados
```

## 📖 Documentação

- [SPEC.md](./SPEC.md) - Requisitos do produto
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura técnica
- [ENDPOINTS.md](./ENDPOINTS.md) - Estrutura de dados

## 🛠 Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Gemini API (Google AI)
- Leaflet (Mapas)
- Recharts (Gráficos)

## 📄 Licença

MIT
