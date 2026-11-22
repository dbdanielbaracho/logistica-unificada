# AT-2026-11-22-02 — Regressão do contrato de CI

Status: PROPOSTO, condicionado a Quality gates e revisão do PR. Origem: reconciliação não destrutiva do PR #54 e governança de AGENTS.md.

## Lacuna e decisão
O PR #54 continha teste de configuração do workflow ainda não incorporado à main, embora as proteções de caminhos sensíveis tenham sido reaplicadas em PRs posteriores. Isolar apenas o teste ainda ausente em branch atualizada, sem reintroduzir implementação ou documentação histórica obsoleta.

## Escopo e evidência
- Workflow próprio: `.github/workflows/ci.yml`, consultado em 2026-11-22; gatilhos push/PR para main, Node 22, `npm test`, `npm run lint`, `npm run build` e permissões read-only.
- PR histórico: https://github.com/dbdanielbaracho/logistica-unificada/pull/54
- Teste novo: `tests/ci-quality-gates-contract.test.mjs` valida invariantes estáticos, sem rede nem dados reais.
- O teste de configuração não substitui a execução hospedada do CI, auditoria de segurança ou testes funcionais.

## Riscos e aceite
Alterações legítimas na sintaxe YAML podem exigir ajuste do teste; falhas do workflow hospedado continuam possíveis. Aceite: PR, execução real do Quality gates, revisão e merge; verificar Railway apenas se ocorrer deploy. Sem alteração de negócio, telas, rotas, pagamentos, contratos ou dados pessoais. O escopo 17 jornadas / 43 telas-base / 107 ações permanece documental e não auditado. Mestre v19 integral continua pendente na issue #1.
