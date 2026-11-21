# AT-2026-11-21-01 — Smoke externo dos cabeçalhos defensivos

Status: proposto em branch, sujeito a CI, revisão, merge e verificação externa independente.

## Origem e limite
Controle geral de segurança permitido por AGENTS.md; issue #53. Não altera telas, rotas comerciais, contratos, dados pessoais nem pagamentos. O Documento Mestre v19 permanece a fonte de verdade. Inventário documental: 17 jornadas, 43 telas-base e 107 ações, sem conclusão funcional auditada.

## Implementação
`scripts/check-public-security-headers.mjs` consulta exclusivamente GET /api/health, com timeout de 8 segundos, sem redirects, cache ou credenciais embutidas na URL. Confere status 200 e os quatro cabeçalhos defensivos definidos em `next.config.ts`: X-Content-Type-Options, Referrer-Policy, X-Frame-Options e Permissions-Policy. Não lê corpo nem envia dados privados. `tests/public-security-headers.test.mjs` cobre sucesso, ausência/alteração de cada cabeçalho, status incorreto, URL insegura e endpoint fixo.

## Critérios de aceite
1. CI executar `npm test`, `npm run lint` e `npm run build` no PR.
2. Após merge, rodar `SMOKE_BASE_URL=https://lu.predibeacon.com node scripts/check-public-security-headers.mjs` e o equivalente para o domínio Railway, em executor com DNS público.
3. Registrar resultado e data; não fechar issue #53 somente com teste simulado.
4. Em caso de falha, investigar proxy e resposta pública sem alterar DNS ou habilitar transações.

Risco: proxies podem modificar cabeçalhos; comparação estrita é intencional e exige validação pública antes de homologação. Este adendo não modifica requisitos de negócio.
