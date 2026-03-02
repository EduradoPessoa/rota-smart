# Arquitetura Técnica - RotaSmart

## Stack

### Frontend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 19 | UI Framework |
| TypeScript | 5.x | Tipagem |
| Vite | 7.x | Build tool |
| Tailwind CSS | 4.x | Estilização |
| Shadcn UI | - | Componentes |

### Serviços
| Serviço | Provider | Uso |
|---------|----------|-----|
| AI | Gemini 2.0 Flash | Extração de dados e otimização |
| Maps | Leaflet + OpenStreetMap | Visualização de rotas |
| Charts | Recharts | Dashboard |
| Icons | Lucide React | Ícones |

### Armazenamento
- **localStorage** - Dados persistidos no navegador
- **Session** - Estado da aplicação

## Arquitetura de Dados

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Upload File   │────▶│  Gemini Service  │────▶│  Review Table   │
│  (TXT/CSV/PDF)  │     │  (AI Extraction) │     │  (Validation)   │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Leaflet Map   │◀────│  Route Optimize  │◀────│  LocalStorage   │
│  (Visualization)│     │  (AI Sequencing) │     │   (Persistence) │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Componentes Principais

### Camada de UI
- `components/ui/*` - Componentes Shadcn
- `App.tsx` - Layout principal

### Camada de Serviços
- `services/api/GeminiService.ts` - Integração com Google AI
- `services/storage/LocalStorageService.ts` - Persistência

### Camada de Utils
- `utils/cep.ts` - Funções de CEP
- `lib/utils.ts` - Utilitários (cn)

## Limitações MVP

| Limite | Valor |
|--------|-------|
| Tamanho arquivo | 5 MB |
| Pedidos por import | 100 |
| Otimização por chamada | 50 |
| Regiões configuráveis | 20 |

## Configuração de Ambiente

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

## Roadmap

- Q2 2026: Geocodificação real
- Q3 2026: Autenticação e cloud
- Q3 2026: App mobile para motoristas
- Q4 2026: Rastreamento GPS
