/**
 * Opções comprovadas da busca PÚBLICA de fretes (EV-001).
 * Não são regras de publicação, contratação profissional ou pagamentos.
 * Este módulo não executa buscas nem acessa dados reais.
 */
export const PUBLIC_FREIGHT_RADII_KM = Object.freeze([50, 100, 200]);

/**
 * Aceita somente os raios documentados, sem coerção implícita.
 * Retorna null para ausência de filtro; lança erro para valores inválidos.
 */
export function parsePublicFreightRadiusKm(value) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'number' || !PUBLIC_FREIGHT_RADII_KM.includes(value)) {
    throw new RangeError('Raio de busca pública de fretes inválido');
  }
  return value;
}

/** Destino é opcional na busca pública, conforme EV-001. */
export function normalizePublicFreightDestination(value) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') {
    throw new TypeError('Destino de busca pública de fretes deve ser texto');
  }
  const normalized = value.trim();
  return normalized === '' ? null : normalized;
}
