import { useState, useEffect } from 'react'
import { Truck, MapPin, Package, BarChart3, Settings, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { storageService } from '@/services/storage/LocalStorageService'
import { geminiService } from '@/services/api/GeminiService'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('import')
  const [apiKey, setApiKey] = useState('')
  const [isApiKeySet, setIsApiKeySet] = useState(false)

  useEffect(() => {
    const settings = storageService.getSettings()
    if (settings.geminiApiKey) {
      geminiService.setApiKey(settings.geminiApiKey)
      setIsApiKeySet(true)
    }
  }, [])

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      geminiService.setApiKey(apiKey.trim())
      storageService.saveSettings({ geminiApiKey: apiKey.trim() })
      setIsApiKeySet(true)
    }
  }

  const menuItems = [
    { id: 'import', label: 'Importar Pedidos', icon: Package },
    { id: 'regions', label: 'Regiões', icon: MapPin },
    { id: 'routes', label: 'Rotas', icon: Truck },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-blue-400" />
              <span className="font-bold text-lg">RotaSmart</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-white"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-slate-800">
          {isSidebarOpen && (
            <Badge variant={isApiKeySet ? 'success' : 'destructive'}>
              {isApiKeySet ? 'API Conectada' : 'API离线'}
            </Badge>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
            <p className="text-slate-500">Gerencie suas entregas de forma inteligente</p>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="hidden">
              {menuItems.map(item => (
                <TabsTrigger key={item.id} value={item.id}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="import">
              <Card>
                <CardHeader>
                  <CardTitle>Importar Pedidos</CardTitle>
                  <CardDescription>
                    Faça upload de arquivos TXT, CSV ou PDF com a lista de pedidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isApiKeySet ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="font-medium text-yellow-800 mb-2">⚠️ API Key necessária</h3>
                        <p className="text-sm text-yellow-700 mb-4">
                          Para importar pedidos, você precisa configurar sua API Key do Gemini.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Cole sua API Key aqui"
                            className="flex-1 px-3 py-2 border rounded-md"
                          />
                          <Button onClick={handleSaveApiKey}>Salvar</Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
                      <Package className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                      <p className="text-slate-600 mb-2">Arraste arquivos aqui ou clique para selecionar</p>
                      <p className="text-sm text-slate-400">TXT, CSV ou PDF (máx. 5MB)</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regions">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Regiões</CardTitle>
                  <CardDescription>
                    Configure as regiões de entrega e seus CEPs correspondentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500">Nenhuma região configurada. Clique para adicionar.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="routes">
              <Card>
                <CardHeader>
                  <CardTitle>Rotas Otimizadas</CardTitle>
                  <CardDescription>
                    Visualize e gerencie as rotas de entrega
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500">Nenhuma rota criada. Importe pedidos para começar.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dashboard">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard</CardTitle>
                  <CardDescription>
                    Métricas e estatísticas das entregas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500">Importe pedidos para ver as métricas.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                  <CardDescription>
                    Configure a aplicação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">API Key do Gemini</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Cole sua API Key aqui"
                        className="flex-1 px-3 py-2 border rounded-md"
                      />
                      <Button onClick={handleSaveApiKey}>Salvar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default App
