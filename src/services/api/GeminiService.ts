import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Order, ImportResult } from '@/types'

const DEFAULT_MODEL = 'gemini-2.0-flash'

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private model: string = DEFAULT_MODEL

  initialize(apiKey: string): void {
    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  isInitialized(): boolean {
    return this.genAI !== null
  }

  setApiKey(apiKey: string): void {
    this.initialize(apiKey)
  }

  async extractOrdersFromText(text: string): Promise<ImportResult> {
    if (!this.genAI) {
      throw new Error('API Key não configurada. Configure nas configurações.')
    }

    const prompt = `
Você é um assistente de extração de dados para logística de entregas.
Analise o texto abaixo que contém pedidos de entrega e extraia as informações em formato JSON.

Para cada pedido, extraia:
- customerName: Nome do cliente
- address: Endereço completo (rua, número, bairro)
- zipCode: CEP (formato XXXXX-XXX ou XXXXXXXX)
- orderValue: Valor do pedido (número)

Retorne APENAS um array JSON com os pedidos extraídos. Use null para campos que não conseguir identificar.
Caso não consig extrair nenhum campo de um pedido, marque como erro.

Texto dos pedidos:
${text}
`

    try {
      const model = this.genAI.getGenerativeModel({ model: this.model })
      const result = await model.generateContent(prompt)
      const response = result.response.text()
      
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('Não foi possível extrair pedidos do texto')
      }

      const extractedOrders = JSON.parse(jsonMatch[0])
      const orders: Order[] = []
      const errors: ImportResult['errors'] = []

      extractedOrders.forEach((item: Partial<Order>, index: number) => {
        const order: Partial<Order> = {
          id: `order_${Date.now()}_${index}`,
          customerName: item.customerName || '',
          address: item.address || '',
          zipCode: item.zipCode || '',
          orderValue: item.orderValue || 0,
          status: 'pending',
        }

        if (!order.customerName || !order.address || !order.zipCode) {
          errors.push({
            row: index,
            field: !order.customerName ? 'customerName' : !order.address ? 'address' : 'zipCode',
            message: 'Campo não identificado pela IA',
          })
        }

        orders.push(order as Order)
      })

      return {
        success: orders.filter(o => o.customerName && o.address && o.zipCode).length,
        failed: errors.length,
        orders,
        errors,
      }
    } catch (error) {
      console.error('Erro na extração de pedidos:', error)
      throw new Error('Falha ao processar pedidos com IA')
    }
  }

  async optimizeRoute(orders: Order[], region?: string): Promise<Order[]> {
    if (!this.genAI) {
      throw new Error('API Key não configurada')
    }

    if (orders.length === 0) return []

    const limitedOrders = orders.slice(0, 50)

    const ordersDescription = limitedOrders
      .map((o, i) => `${i + 1}. ${o.customerName} - CEP: ${o.zipCode} - Endereço: ${o.address}`)
      .join('\n')

    const prompt = `
Você é um assistente de otimização de rotas de entrega.
Given the following delivery orders, reordene-os em uma sequência otimizada para entrega, priorizando proximidade geográfica pelo CEP.

Ordens atuais:
${ordersDescription}

${region ? `Priorize a região: ${region}` : ''}

Retorne APENAS um array JSON com os índices dos pedidos na nova ordem (0-based).
Exemplo: [0, 3, 1, 2]
`

    try {
      const model = this.genAI.getGenerativeModel({ model: this.model })
      const result = await model.generateContent(prompt)
      const response = result.response.text()

      const jsonMatch = response.match(/\[[\s\d,]*\]/)
      if (!jsonMatch) {
        throw new Error('Não foi possível otimizar a rota')
      }

      const newSequence = JSON.parse(jsonMatch[0])

      const optimizedOrders: Order[] = []
      newSequence.forEach((index: number, seq: number) => {
        if (limitedOrders[index]) {
          optimizedOrders.push({
            ...limitedOrders[index],
            sequence: seq + 1,
          })
        }
      })

      return optimizedOrders
    } catch (error) {
      console.error('Erro na otimização de rota:', error)
      throw new Error('Falha ao otimizar rota com IA')
    }
  }
}

export const geminiService = new GeminiService()
