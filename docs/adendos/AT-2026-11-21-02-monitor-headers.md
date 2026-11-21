# AT-2026-11-21-02 — Monitoramento externo dos cabeçalhos HTTP

**Status:** proposta técnica reversível, sujeita a CI, revisão, merge e execução externa comprovada.

## Lacuna e fundamento

O verificador isolado `scripts/check-public-security-headers.mjs` foi incorporado no PR #59, mas o workflow agendado `.github/workflows/external-health.yml` executava somente `scripts/smoke-health.mjs`. Portanto, o sucesso periódico de saúde não atestava os cabeçalhos HTTP de segurança (issue #53).

## Decisão técnica

Executar o verificador já existente em **ambos** os jobs independentes, depois do contrato de saúde, sem introduzir dependências, credenciais, novas chamadas autenticadas ou mudanças no servidor. Cada job falha se o contrato de saúde ou qualquer cabeçalho exigido estiver incorreto. O script usa requisição pública somente leitura a `/api/health`, timeout, `redirect: error` e `cache: no-store`. A política de cabeçalhos permanece definida no próprio script versionado, não duplicada no workflow.

## Teste e aceite

1. Validar sintaxe do workflow e testes existentes do verificador nos Quality gates do PR.
2. Confirmar execução real do workflow agendado ou manual nos dois jobs, com sucesso **de ambas** as etapas de cabeçalhos e saúde.
3. Registrar URLs das execuções, horário e deployment em `docs/implementacao.md` ou issue #53, sem publicar IPs, tokens ou corpos de resposta.
4. Se o ambiente externo falhar por DNS/rede, manter o status pendente e investigar sem desabilitar controles.

## Riscos e limites

Falha transitória de DNS ou rede pode produzir alerta; os jobs independentes distinguem os domínios. O teste só cobre os quatro cabeçalhos da rota pública de saúde, não todos os caminhos, configurações privadas ou uma auditoria de segurança completa. Não valida nem libera 17 jornadas, 43 telas-base, 107 ações, pagamentos, contratos ou dados pessoais. A versão integral controlada do Mestre v19 continua pendente na issue #1.

**Referências internas:** PR #59, issue #53, `AGENTS.md`, `docs/implementacao.md`, `scripts/check-public-security-headers.mjs`. Nenhuma regra comercial ou prática concorrencial foi inferida nesta alteração puramente operacional.
