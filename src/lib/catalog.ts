/** Navegação sem simular contratos ou transações financeiras. */
export type Profile = 'empresa' | 'caminhoneiro' | 'motorista' | 'ajudante';
export type RouteId = 'fretes' | 'caminhoes' | 'contratos-motorista' | 'contratos-ajudante' | 'oportunidades' | 'atividades';
export const profiles: Record<Profile, { title: string; description: string; actions: { label: string; route: RouteId }[] }> = {
  empresa: { title: 'Empresas', description: 'Serviços para empresas contratantes.', actions: [
    { label: 'Publicar frete', route: 'fretes' }, { label: 'Buscar caminhões', route: 'caminhoes' },
    { label: 'Contratar motorista', route: 'contratos-motorista' }, { label: 'Contratar ajudante', route: 'contratos-ajudante' }] },
  caminhoneiro: { title: 'Caminhoneiros', description: 'Encontre oportunidades de transporte.', actions: [
    { label: 'Buscar fretes', route: 'fretes' }, { label: 'Minhas atividades', route: 'atividades' }] },
  motorista: { title: 'Motoristas', description: 'Encontre oportunidades profissionais.', actions: [
    { label: 'Encontrar oportunidades', route: 'oportunidades' }, { label: 'Minhas atividades', route: 'atividades' }] },
  ajudante: { title: 'Ajudantes', description: 'Encontre serviços de apoio logístico.', actions: [
    { label: 'Encontrar oportunidades', route: 'oportunidades' }, { label: 'Minhas atividades', route: 'atividades' }] }
};
export const routeCopy: Record<RouteId, {title: string; description: string}> = {
  fretes: { title: 'Fretes', description: 'Funcionalidade em implementação conforme o Documento Mestre.' },
  caminhoes: { title: 'Caminhões', description: 'Funcionalidade em implementação conforme o Documento Mestre.' },
  'contratos-motorista': { title: 'Contratar motorista', description: 'Funcionalidade em implementação conforme o Documento Mestre.' },
  'contratos-ajudante': { title: 'Contratar ajudante', description: 'Funcionalidade em implementação conforme o Documento Mestre.' },
  oportunidades: { title: 'Oportunidades', description: 'Funcionalidade em implementação conforme o Documento Mestre.' },
  atividades: { title: 'Minhas atividades', description: 'Funcionalidade em implementação conforme o Documento Mestre.' }
};
