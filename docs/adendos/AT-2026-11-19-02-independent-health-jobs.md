# Adendo técnico ao Mestre v19 — AT-2026-11-19-02

**Estado:** proposta técnica em PR; sem alteração funcional do Mestre v19.

## Problema e evidência

O monitor `.github/workflows/external-health.yml` executava dois checks em sequência no mesmo job. Se o primeiro falhasse, o GitHub Actions encerraria o job e não executaria o segundo, impedindo saber se a falha era comum aos dois domínios ou específica do primeiro. O código original e seus testes foram consultados no repositório em 2026-11-19. Logs HTTP Railway mostraram respostas 200 de `/api/health` em ambos os domínios em 2026-11-19 às 18:59 UTC, mas não revelam o corpo JSON.

## Decisão reversível

Separar as verificações em dois jobs independentes `railway-health` e `custom-domain-health`, cada um com limite de cinco minutos, Node 22 e o mesmo `scripts/smoke-health.mjs`. Cada falha permanece visível e faz falhar o workflow, sem `continue-on-error`. Preservar agendamento, disparo manual e permissões mínimas.

## Critérios de aceite e riscos

Testes em `tests/custom-domain-workflow.test.mjs` devem garantir exatamente dois jobs, um endpoint por job, timeout e ausência de segredos. CI deve passar antes do merge. A execução externa agendada deve ser verificada separadamente; CI de PR não comprova saúde externa. Custo adicional: dois runners por execução; limite de cinco minutos por job. Sem alterar DNS, dados pessoais, contratação ou pagamentos.

**Escopo funcional preservado:** 17 jornadas, 43 telas-base e 107 ações continuam inventário documental, com rastreabilidade bloqueada na issue #1.
