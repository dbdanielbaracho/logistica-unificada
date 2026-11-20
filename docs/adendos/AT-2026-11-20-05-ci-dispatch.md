# AT-2026-11-20-05 — Disparo manual dos quality gates

Data: 2026-11-20. Escopo: engenharia/CI; não altera o Documento Mestre v19, jornadas, telas, ações ou regras comerciais.

## Evidência e lacuna

Fonte interna: `.github/workflows/ci.yml` na branch `main`, consultada em 2026-11-20. Já existem gatilhos `push` e `pull_request`, com `npm test`, `npm run lint` e `npm run build`. Consulta de workflow runs associada ao commit `4f6aac63` e de status checks retornou listas vazias; isso **não prova** que Actions esteja desativado, pois a consulta é limitada a execuções de pull request e não substitui inspeção completa da aba Actions.

## Decisão

Adicionar `workflow_dispatch` ao workflow existente, preservando os gatilhos, comandos e permissão mínima `contents: read`. Acrescentar teste estático de regressão. Mudança reversível, sem segredos e sem efeito no serviço Railway até merge. Não alegar que o disparo manual já foi executado.

## Aceite e riscos

Após revisão e merge, acionar manualmente o workflow pela interface GitHub Actions e confirmar os jobs. Se a opção não aparecer ou execução falhar, investigar permissões da organização/repositório e logs do Actions. A opção manual não resolve sozinha bloqueios de permissões. Não promover PRs #52/#54 sem testes comprovados.

Documento Mestre v19: 17 jornadas, 43 telas-base e 107 ações são escopo documental, não conclusão funcional. Fluxos financeiros, contratos e dados pessoais permanecem desabilitados.
