import type { Order, Region, Route, AppSettings } from '@/types'

const STORAGE_KEYS = {
  ORDERS: 'rotasmart_orders',
  REGIONS: 'rotasmart_regions',
  ROUTES: 'rotasmart_routes',
  SETTINGS: 'rotasmart_settings',
} as const

class LocalStorageService {
  // Orders
  getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS)
    return data ? JSON.parse(data) : []
  }

  saveOrders(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
  }

  addOrder(order: Order): void {
    const orders = this.getOrders()
    orders.push(order)
    this.saveOrders(orders)
  }

  updateOrder(orderId: string, updates: Partial<Order>): void {
    const orders = this.getOrders()
    const index = orders.findIndex(o => o.id === orderId)
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates }
      this.saveOrders(orders)
    }
  }

  deleteOrder(orderId: string): void {
    const orders = this.getOrders().filter(o => o.id !== orderId)
    this.saveOrders(orders)
  }

  // Regions
  getRegions(): Region[] {
    const data = localStorage.getItem(STORAGE_KEYS.REGIONS)
    return data ? JSON.parse(data) : []
  }

  saveRegions(regions: Region[]): void {
    localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(regions))
  }

  addRegion(region: Region): void {
    const regions = this.getRegions()
    regions.push(region)
    this.saveRegions(regions)
  }

  updateRegion(regionId: string, updates: Partial<Region>): void {
    const regions = this.getRegions()
    const index = regions.findIndex(r => r.id === regionId)
    if (index !== -1) {
      regions[index] = { ...regions[index], ...updates }
      this.saveRegions(regions)
    }
  }

  deleteRegion(regionId: string): void {
    const regions = this.getRegions().filter(r => r.id !== regionId)
    this.saveRegions(regions)
  }

  // Routes
  getRoutes(): Route[] {
    const data = localStorage.getItem(STORAGE_KEYS.ROUTES)
    return data ? JSON.parse(data) : []
  }

  saveRoute(route: Route): void {
    const routes = this.getRoutes()
    routes.push(route)
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes))
  }

  deleteRoute(routeId: string): void {
    const routes = this.getRoutes().filter(r => r.id !== routeId)
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes))
  }

  // Settings
  getSettings(): AppSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    const defaults: AppSettings = {
      maxFileSize: 5 * 1024 * 1024, // 5 MB
      maxOrdersPerImport: 100,
      maxOrdersPerOptimization: 50,
    }
    return data ? { ...defaults, ...JSON.parse(data) } : defaults
  }

  saveSettings(settings: Partial<AppSettings>): void {
    const current = this.getSettings()
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }))
  }

  // Clear all data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }

  // Export data as CSV
  exportOrdersAsCSV(): string {
    const orders = this.getOrders()
    if (orders.length === 0) return ''

    const headers = ['ID', 'Cliente', 'Endereço', 'CEP', 'Valor', 'Região', 'Status', 'Sequência']
    const rows = orders.map(o => [
      o.id,
      o.customerName,
      o.address,
      o.zipCode,
      o.orderValue.toString(),
      o.region || '',
      o.status,
      o.sequence?.toString() || ''
    ])

    return [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
  }
}

export const storageService = new LocalStorageService()
