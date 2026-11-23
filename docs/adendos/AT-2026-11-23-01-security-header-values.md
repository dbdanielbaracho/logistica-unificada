# AT-2026-11-23-01 — Regressão dos valores de cabeçalhos defensivos

## Origem e limite

Controle técnico de segurança autorizado por AGENTS.md (qualidade e OWASP); sem alteração de regra comercial do Documento Mestre v19.0. Escopo documental preservado: 17 jornadas, 43 telas-base e 107 ações, nenhuma declarada concluída por este adendo.

## Lacuna identificada

O teste existente `tests/security-headers.test.mjs` verifica nomes dos cabeçalhos e abrangência da rota, mas não impede alteração silenciosa dos valores protetivos. A configuração atual está em `next.config.ts`.

## Decisão e teste

Adicionar `tests/security-header-values-regression.test.mjs` com asserções locais dos valores atuais de `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` e `Permissions-Policy`, além da abrangência global. Execução prevista pelo `npm test` e Quality gates; aguardar CI real antes de incorporar.

## Riscos e aceite

Teste estático é sensível à formatação e não comprova os cabeçalhos efetivamente enviados pelo servidor, segurança completa ou homologação. Validar posteriormente via teste HTTP em build de produção; não expor credenciais, IPs ou corpos de respostas. Nenhuma mudança em pagamentos, fretes, contratação profissional, contratos ou dados pessoais. Issue #53 permanece aberta até todos os critérios serem verificados. PR #54: o arquivo `tests/security-sensitive-status-regression.test.mjs` já existe na main com conteúdo equivalente ao patch antigo, portanto não reaplicar.

## Evidência interna (2026-11-23)

- `next.config.ts` e `tests/security-headers.test.mjs` na main, inspecionados nesta execução
- PR #54: https://github.com/dbdanielbaracho/logistica-unificada/pull/54
- Issue #53: https://github.com/dbdanielbaracho/logistica-unificada/issues/53
