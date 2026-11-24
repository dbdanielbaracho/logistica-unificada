// Dados exclusivamente de teste; não representam regras comerciais.
export const categories = Object.freeze(['empresas','transportadoras','motoristas','ajudantes','veiculos','publicacoesFrete','pesquisasFrete','contratacoesMotorista','contratacoesAjudante','viagens','pagamentosSimulados','contratosSimulados','atendimentos','avaliacoes']);
export function fixtures() {
  return Object.fromEntries(categories.map(category => [category, Array.from({length:30}, (_,i) => {
    const scenario = i < 10 ? 'positivo' : i < 20 ? 'negativo' : 'limite';
    const domain = ['publicacoesFrete','pesquisasFrete','viagens'].includes(category) ? 'frete' : category === 'contratacoesMotorista' ? 'motorista' : category === 'contratacoesAjudante' ? 'ajudante' : ['pagamentosSimulados','contratosSimulados'].includes(category) ? (i%2===0?'frete':'profissional') : 'cadastro-teste';
    return {id: 'TEST-'+category+'-'+String(i+1).padStart(2,'0'), category, scenario, domain, synthetic:true, executable:false, input: category === 'pesquisasFrete' ? {origem: i<10?'Origem fictícia '+i:i<20?'':'Origem fictícia', destino:i%2?'Destino fictício':undefined, raio:i<10?[50,100,200][i%3]:i<20?-1:[50,200][i%2]} : {reference:'TEST-'+i, label:i<10?'Amostra fictícia '+i:i<20?null:'X'.repeat(i+1)}};
  })]));
}
