# AT-2026-11-19-04 — Regressão de exposição de caminhos sensíveis

Status: PROPOSTO, sujeito a CI, revisão e verificação externa. Referência: issue #53.

## Fonte e evidência
- Logs HTTP do Railway para o serviço logistica-web, consultados em 2026-11-19: sondagens de caminhos de configuração (por exemplo, `/.vscode/sftp.json`, `/config/local.json`, `/service_account.json`) responderam 404.
- Issue operacional: https://github.com/dbdanielbaracho/logistica-unificada/issues/53
- Cabeçalhos já definidos em `next.config.ts`; não se presume que a simples presença no código prove aplicação em produção.

## Decisão técnica
Adicionar testes de regressão sem segredos reais: inventário fixo de caminhos, conferência estática de cabeçalhos e smoke HTTPS opcional em host explicitamente permitido por `SECURITY_TEST_BASE_URL`. A execução padrão não faz solicitações externas. O smoke não deve ser interpretado como pentest ou garantia de ausência de vazamento.

## Escopo e risco
Sem alteração de jornadas, telas, ações, contratos, pagamentos ou dados pessoais. Sem varredura ampla nem logging de respostas. O smoke é limitado a sete caminhos e a dois domínios autorizados. Riscos: 404 pode mascarar falhas de segurança em outras rotas; a proteção real exige auditoria adicional, inclusive do build e da configuração de publicação.

## Aceite
CI de testes e build aprovado; execução autorizada do smoke HTTPS documentada; revisão e merge em PR. Até lá: NÃO HOMOLOGADO.

## Complemento de regressão — 2026-11-20
- `tests/security-sensitive-status-regression.test.mjs` cobre respostas 200, 204, 301, 302, 401, 403 e 500, além de falha de rede simulada. Apenas HTTP 404 pode ser considerado aprovado.
- O teste confirma política de redirecionamento manual, ausência de cache e não inclusão de corpos de resposta nos resultados. Usa somente respostas sintéticas e não acessa serviços públicos.
- Aceite permanece condicionado a CI e revisão; ausência de status checks não equivale a aprovação. Não houve alteração de regra comercial ou do inventário 17/43/107.

## Complemento de contrato — 2026-11-20, 05h (Brasília)
- `tests/security-sensitive-contract-regression.test.mjs` verifica o resultado exato de sete respostas 404, opções de fetch, ausência de corpos sensíveis nos resultados e rejeição de URLs inseguras antes de qualquer acesso de rede. Testes inteiramente sintéticos.
- CI: consultas a workflow runs e status checks do commit anterior `e280e2f1` retornaram listas vazias; isto não constitui aprovação nem prova de falha. Validar pelo painel GitHub Actions e pelos jobs do PR antes de merge.
- Railway: deployment `fafe8fc1` permanece SUCCESS com commit `4be3f09c`; não contém as mudanças deste PR. Não houve homologação comercial ou funcional.

## Integração sobre main — 2026-11-20
- Reaplicação não destrutiva dos testes isolados após merge dos PRs #55 e #52, sem reintroduzir o teste de CI antigo incompatível com `workflow_dispatch`.
- O smoke externo de produção permanece pendente de verificação separada; a inclusão destes testes não homologa o ambiente público.
- Fonte técnica: https://github.com/dbdanielbaracho/logistica-unificada/pull/54 e issue https://github.com/dbdanielbaracho/logistica-unificada/issues/53.
