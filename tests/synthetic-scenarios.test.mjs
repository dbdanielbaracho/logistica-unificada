import test from 'node:test';
import assert from 'node:assert/strict';
import {categories, fixtures} from './fixtures/synthetic-scenarios.mjs';
test('420 deterministic isolated fixtures',()=>{
 const data=fixtures(); assert.deepEqual(data,fixtures());
 const all=Object.values(data).flat(); assert.equal(all.length,420);
 assert.equal(new Set(all.map(x=>x.id)).size,420);
 for(const category of categories){
  const rows=data[category]; assert.equal(rows.length,30);
  for(const scenario of ['positivo','negativo','limite']) assert.equal(rows.filter(x=>x.scenario===scenario).length,10);
  assert.ok(rows.every(x=>x.synthetic===true && x.executable===false && x.category===category));
 }
 data.empresas[0].input.label='alterado'; assert.notEqual(fixtures().empresas[0].input.label,'alterado');
});
test('frete and professional scenarios remain separate',()=>{
 const data=fixtures();
 assert.ok(data.contratacoesMotorista.every(x=>x.domain==='motorista'));
 assert.ok(data.contratacoesAjudante.every(x=>x.domain==='ajudante'));
 for(const key of ['pagamentosSimulados','contratosSimulados']) assert.deepEqual([...new Set(data[key].map(x=>x.domain))].sort(),['frete','profissional']);
});
test('search fixtures cover documented radii and optional destination',()=>{
 const rows=fixtures().pesquisasFrete;
 assert.deepEqual([...new Set(rows.filter(x=>x.scenario==='positivo').map(x=>x.input.raio))].sort((a,b)=>a-b),[50,100,200]);
 assert.ok(rows.some(x=>x.input.destino===undefined));
 assert.ok(rows.filter(x=>x.scenario==='negativo').every(x=>x.input.origem==='' && x.input.raio===-1));
});
