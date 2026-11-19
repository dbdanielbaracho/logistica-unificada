# Adendo técnico controlado ao Mestre v19 — AT-2026-11-19-01

**Estado:** adendo técnico incorporado à `main` pelo PR #49 (commit `7cfac03a574f6a5c69ec0d2848194458e10934a1`), sem alteração do escopo funcional do Mestre v19. A execução externa do monitor permanece sujeita à comprovação.

## Motivação e evidência

O serviço Railway `logistica-web` passou a aceitar o domínio público `lu.predibeacon.com`. A API Railway informou propriedade verificada e certificado HTTPS válido em 2026-11-19, embora a leitura de CNAME ainda retorne `DNS_RECORD_STATUS_REQUIRES_UPDATE`. Logs HTTP do Railway mostraram resposta 200 para `/` nesse domínio, o que não comprova o contrato JSON de `/api/health`.

Referências: [procedimento público de saúde](../diagnostico-health-publico.md), [monitor agendado](../../.github/workflows/external-health.yml), [controle de implementação](../implementacao.md).

## Decisão técnica reversível

Adicionar **segunda verificação independente** no monitor público agendado: manter `https://logistica-web-production-cfbeefaa.up.railway.app/api/health` e testar também `https://lu.predibeacon.com/api/health`, com o mesmo script que exige HTTP 200, JSON e contrato `status=ok, service=logistica-unificada`. Falhas não são mascaradas. Não incluir credenciais, dados pessoais ou operações financeiras.

## Testes, riscos e aceite

Teste automatizado `tests/custom-domain-workflow.test.mjs` verifica ambos os hostnames, execução independente, ausência de segredos e fail-fast. Gate de aceite: CI do PR aprovado e execução agendada/manual externa comprovada; deployment SUCCESS isolado não é homologação HTTP. Riscos: falha de propagação DNS, proxy Cloudflare e indisponibilidade transitória gerarem alerta; investigar logs e DNS antes de alterar produção.

**Sem impacto funcional:** 17 jornadas, 43 telas-base e 107 ações continuam inventário documental, com matriz `BLOQUEADO_POR_EVIDENCIA` (issue #1). Este adendo não define jornada, tela, ação, contrato ou pagamento.
