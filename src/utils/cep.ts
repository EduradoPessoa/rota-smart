import type { Region } from '@/types'

// Format CEP to XXXXX-XXX or XXXXXXXX
export function formatCEP(cep: string): string {
  const clean = cep.replace(/\D/g, '')
  if (clean.length === 8) {
    return `${clean.slice(0, 5)}-${clean.slice(5)}`
  }
  return cep
}

// Clean CEP (remove formatting)
export function cleanCEP(cep: string): string {
  return cep.replace(/\D/g, '')
}

// Extract numeric part for comparison
export function cepToNumber(cep: string): number {
  const clean = cleanCEP(cep)
  return parseInt(clean, 10) || 0
}

// Check if CEP is valid (Brazilian format)
export function isValidCEP(cep: string): boolean {
  const clean = cleanCEP(cep)
  return clean.length === 8 && /^\d{8}$/.test(clean)
}

// Find region for a given CEP
export function findRegionByCEP(cep: string, regions: Region[]): Region | undefined {
  const cepNum = cepToNumber(cep)
  
  return regions.find(region => {
    const start = cepToNumber(region.zipCodeStart)
    const end = cepToNumber(region.zipCodeEnd)
    return cepNum >= start && cepNum <= end
  })
}

// Check if two CEP ranges overlap
export function cepRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = cepToNumber(start1)
  const e1 = cepToNumber(end1)
  const s2 = cepToNumber(start2)
  const e2 = cepToNumber(end2)

  return !(e1 < s2 || e2 < s1)
}

// Get approximate coordinates from CEP (MVP approximation)
export function getApproximateCoordsFromCEP(cep: string): [number, number] {
  // MVP: This is a placeholder that returns São Paulo coordinates
  // Real geocoding will be implemented in Q2 2026 roadmap
  const clean = cleanCEP(cep)
  const base = parseInt(clean.slice(0, 2), 10) || 0
  
  // Rough approximation for Brazil major cities based on CEP prefix
  // This is a simplified MVP implementation
  const cityCoords: Record<number, [number, number]> = {
    0: [-23.5505, -46.6333], // SP capital
    10: [-23.5505, -46.6333], // SP
    20: [-22.9068, -43.1729], // RJ
    30: [-19.9167, -43.9345], // BH
    40: [-12.9714, -38.5014], // Salvador
    50: [-8.0476, -34.8770], // Recife
    60: [-3.7172, -38.5433], // Fortaleza
    70: [-15.7801, -47.9292], // Brasília
    80: [-23.9618, -46.3322], // Santos
    90: [-25.4284, -49.2673], // Curitiba
  }

  const prefix = Math.floor(base / 10) * 10
  return cityCoords[prefix] || [-23.5505, -46.6333] // Default: São Paulo
}
