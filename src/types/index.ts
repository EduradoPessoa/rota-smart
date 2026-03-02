// Order types
export interface Order {
  id: string
  customerName: string
  address: string
  zipCode: string
  orderValue: number
  region?: string
  status: OrderStatus
  sequence?: number
  latitude?: number
  longitude?: number
}

export type OrderStatus = 'pending' | 'in_progress' | 'delivered' | 'failed'

// Region types
export interface Region {
  id: string
  name: string
  zipCodeStart: string
  zipCodeEnd: string
}

// Import types
export interface ImportResult {
  success: number
  failed: number
  orders: Order[]
  errors: ImportError[]
}

export interface ImportError {
  row: number
  field: string
  message: string
}

// Route types
export interface Route {
  id: string
  name: string
  orders: Order[]
  totalDistance?: number
  estimatedTime?: number
  createdAt: Date
}

// File types
export type SupportedFileType = 'txt' | 'csv' | 'pdf'

export interface FileUpload {
  name: string
  type: SupportedFileType
  size: number
  content: string
}

// Map types
export interface MapMarker {
  id: string
  order: Order
  position: [number, number]
  sequence: number
}

// Dashboard types
export interface DashboardMetrics {
  totalOrders: number
  deliveredOrders: number
  pendingOrders: number
  inProgressOrders: number
  ordersByRegion: RegionStats[]
}

export interface RegionStats {
  region: string
  count: number
}

// App settings
export interface AppSettings {
  geminiApiKey?: string
  maxFileSize: number
  maxOrdersPerImport: number
  maxOrdersPerOptimization: number
}
