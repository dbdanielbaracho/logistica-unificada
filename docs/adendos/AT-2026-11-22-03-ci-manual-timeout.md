# AT-2026-11-22-03 — Contrato de execução manual e limite de CI

Status: **PROPOSTO**. Natureza: controle técnico de engenharia; sem mudança funcional.

## Lacuna e referência

O workflow de qualidade da aplicação possui gatilho manual, permissões de leitura e limite de 15 minutos. O teste anterior `tests/ci-quality-gates-contract.test.mjs` já protege push/PR, Node 22 e comandos de testes, tipos e build, mas não protege explicitamente o gatilho manual nem o limite de duração.

Referências internas verificadas em 2026-11-22: `.github/workflows/ci.yml`, `tests/ci-quality-gates-contract.test.mjs`, `AGENTS.md` e `docs/implementacao.md`. Não há requisito comercial novo nem alegação sobre concorrentes.

## Decisão e risco

Adicionar teste isolado de configuração para preservar `workflow_dispatch`, permissões de leitura sem `write` explícito e timeout entre 1 e 30 minutos no job de verificação. Isso reduz o risco de alterações acidentais no workflow eliminarem reexecução manual ou deixarem jobs sem limite. Não garante a execução efetiva do CI, a segurança de actions externas nem a aprovação do build.

## Aceite

CI Quality gates real no PR com `npm test`, `npm run lint` e `npm run build`; revisão antes de merge. Caso checks não estejam acessíveis, manter PR aberto. Sem tocar em pagamentos, contratos, dados pessoais ou jornadas comerciais.

O inventário documental do Mestre v19 continua **17 jornadas, 43 telas-base e 107 ações**; conclusão funcional não auditada (N/D). Issues #1 e #53 permanecem independentes.
