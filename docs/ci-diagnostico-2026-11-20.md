# Diagnóstico dos Quality gates — 2026-11-20

Status: **NÃO VERIFICADO no GitHub Actions**. Não interpretar lista vazia de runs/status como sucesso ou falha do teste.

## Evidências verificadas
- Workflow em `.github/workflows/ci.yml` na main: eventos `push` para `main` e `pull_request` para `main`; job `verify` executa `npm test`, `npm run lint` e `npm run build` em Node 22.
- Consultas do conector GitHub ao commit `62f532a8` do PR #54 em 2026-11-20: `fetch_commit_workflow_runs` retornou `workflow_runs: []` e `get_commit_combined_status` retornou `statuses: []`. O primeiro endpoint expõe apenas runs de PR na primeira página; status checks não são necessariamente cobertos pelo segundo.
- PRs #52 e #54 continuam abertos. Não houve evidência suficiente para merge.
- Railway: deployment `fafe8fc1` SUCCESS na main `4be3f09c` (2026-11-19 22:24 UTC); não contém o código proposto nos PRs.
- Logs HTTP do Railway consultados em 2026-11-20 mostraram GET /api/health com HTTP 200 nos domínios Railway e personalizado às 08:40 UTC; não houve validação do JSON nessa consulta.

## Hipóteses ainda não comprovadas
Execuções ausentes podem refletir Actions desabilitado, permissão/configuração do repositório, política de workflows, limitação do endpoint de consulta ou ausência efetiva de execução. Não atribuir causa sem evidência.

## Ações de desbloqueio
1. Inspecionar https://github.com/dbdanielbaracho/logistica-unificada/actions e a aba Checks de cada PR; verificar se Actions está habilitado e se o workflow Quality gates aparece.
2. Confirmar que cada PR tem base `main`, head atualizado e eventos elegíveis; consultar jobs/logs concretos quando houver ID de run.
3. Executar localmente `npm install --no-audit --no-fund && npm test && npm run lint && npm run build` em ambiente limpo e registrar saída e commit.
4. Corrigir qualquer falha reproduzível em branch/PR. Somente incorporar com evidência de gates e revisão adequada.

## Proteção adicional proposta
`tests/ci-quality-gates-contract.test.mjs` protege gatilhos e comandos essenciais do workflow. É teste de configuração, **não substitui** uma execução real do GitHub Actions.

Referências: https://github.com/dbdanielbaracho/logistica-unificada/pull/54 ; https://github.com/dbdanielbaracho/logistica-unificada/pull/52 ; https://github.com/dbdanielbaracho/logistica-unificada/actions

Sem alteração das regras de fretes, contratação profissional, finanças ou dados pessoais. Escopo documental de 17 jornadas, 43 telas-base e 107 ações permanece não auditado.
