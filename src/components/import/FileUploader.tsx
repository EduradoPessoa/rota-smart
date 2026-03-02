import { useState, useRef } from 'react'
import { Upload, FileText, File, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface FileUploaderProps {
  onFileSelect: (content: string, fileName: string) => void
  maxSize?: number // in bytes
  acceptedTypes?: string[]
}

export function FileUploader({
  onFileSelect,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['.txt', '.csv', '.pdf']
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedTypes.includes(extension)) {
      return `Tipo de arquivo não suportado. Use: ${acceptedTypes.join(', ')}`
    }
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024))
      return `Arquivo muito grande. Máximo: ${maxMB}MB`
    }
    return null
  }

  const readFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
      reader.readAsText(file)
    })
  }

  const handleFile = async (file: File) => {
    setError(null)
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const content = await readFile(file)
      setFileName(file.name)
      onFileSelect(content, file.name)
    } catch (err) {
      setError('Erro ao processar arquivo. Tente novamente.')
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      await handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFile(file)
    }
  }

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase()
    if (ext === 'csv') return <FileText className="h-10 w-10 text-green-500" />
    if (ext === 'pdf') return <File className="h-10 w-10 text-red-500" />
    return <FileText className="h-10 w-10 text-blue-500" />
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {fileName ? (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
          <div className="flex items-center gap-3">
            {getFileIcon(fileName)}
            <div>
              <p className="font-medium">{fileName}</p>
              <p className="text-sm text-slate-500">Pronto para processamento</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setFileName(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}
          >
            Trocar arquivo
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleInputChange}
            className="hidden"
          />
          <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
          <p className="text-slate-600 mb-2">
            Arraste arquivos aqui ou clique para selecionar
          </p>
          <p className="text-sm text-slate-400">
            TXT, CSV ou PDF (máx. {Math.round(maxSize / (1024 * 1024))}MB)
          </p>
        </div>
      )}
    </div>
  )
}
