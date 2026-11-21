# AT-2026-11-21-03 — Regressão do monitor HTTP externo

Data: 2026-11-21. Natureza: controle de qualidade de infraestrutura, sem alteração funcional do Documento Mestre v19.0.

## Motivação e decisão
O workflow `.github/workflows/external-health.yml` passou a executar a verificação dos quatro cabeçalhos defensivos após o monitor de saúde em cada um dos dois domínios públicos (AT-2026-11-21-02). Uma regressão futura poderia remover um desses passos silenciosamente. Adicionar teste automatizado que exige os dois passos por job, alvos fixos distintos, sem segredos e sem `continue-on-error: true`.

## Escopo e riscos
- Nenhuma jornada, tela-base, ação comercial, formulário, contrato ou pagamento é criada ou homologada.
- Nenhuma requisição externa é feita pelo teste: ele valida apenas o arquivo YAML versionado.
- O teste não comprova cabeçalhos reais em produção; esse aceite depende de execução externa do workflow após o merge e da issue #53.
- A matriz integral permanece `BLOQUEADO_POR_EVIDENCIA` pela issue #1, até obtenção controlada do Mestre v19 integral.
- Falhas legítimas de mudança no workflow exigirão atualização consciente do teste, preservando dois alvos independentes.

## Rastreabilidade técnica
Teste: `tests/external-security-monitor-workflow.test.mjs`.
Workflow: `.github/workflows/external-health.yml`.
Documentos: `AGENTS.md`, `docs/implementacao.md`, `docs/matriz-rastreabilidade.md`.
Referência técnica: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
