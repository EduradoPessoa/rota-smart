# Estrutura de Dados - RotaSmart

## Order (Pedido)

```typescript
interface Order {
  id: string                    // Unique identifier (order_timestamp_index)
  customerName: string          // Nome do cliente
  address: string              // Endereço completo
  zipCode: string             // CEP (XXXXX-XXX)
  orderValue: number          // Valor do pedido
  region?: string             // Região自动-atribuída
  status: OrderStatus         // Estado do pedido
  sequence?: number           // Número na rota
  latitude?: number           // Latitude aproximada
  longitude?: number         // Longitude aproximada
}

type OrderStatus = 'pending' | 'in_progress' | 'delivered' | 'failed'
```

## Region (Região)

```typescript
interface Region {
  id: string           // Unique identifier
  name: string        // Nome da região (ex: "Centro")
  zipCodeStart: string // CEP inicial (ex: "01000-000")
  zipCodeEnd: string   // CEP final (ex: "01999-999")
}
```

## Route (Rota)

```typescript
interface Route {
  id: string           // Unique identifier
  name: string        // Nome da rota
  orders: Order[]      // Pedidos na sequência
  totalDistance?: number // Distância estimada (km)
  estimatedTime?: number // Tempo estimado (min)
  createdAt: Date     // Data de criação
}
```

## ImportResult (Resultado de Importação)

```typescript
interface ImportResult {
  success: number     // Qtd extraídos com sucesso
  failed: number      // Qtd com erro
  orders: Order[]    // Pedidos extraídos
  errors: ImportError[] // Erros detalhados
}

interface ImportError {
  row: number        // Linha do arquivo
  field: string      // Campo com erro
  message: string   // Mensagem do erro
}
```

## AppSettings (Configurações)

```typescript
interface AppSettings {
  geminiApiKey?: string   // Chave da API
  maxFileSize: number    // 5 MB
  maxOrdersPerImport: number   // 100
  maxOrdersPerOptimization: number // 50
}
```

## LocalStorage Keys

| Chave | Dados |
|-------|-------|
| `rotasmart_orders` | Array de Order |
| `rotasmart_regions` | Array de Region |
| `rotasmart_routes` | Array de Route |
| `rotasmart_settings` | AppSettings |

## Limites de Validação

| Campo | Regra |
|-------|-------|
| customerName | Obrigatório, min 2 chars |
| address | Obrigatório, min 5 chars |
| zipCode | Obrigatório, formato válido (8 dígitos) |
| orderValue | Opcional, >= 0 |
| region | Opcional |
```
