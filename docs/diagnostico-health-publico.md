# Diagnóstico seguro do endpoint público de saúde

Data: 2026-11-19. Escopo: engenharia, sem mudança de jornada, tela, ação, contrato ou pagamento.

O domínio público cadastrado no Railway para `logistica-web` é `logistica-web-production-cfbeefaa.up.railway.app`. A implantação SUCCESS e o log Next.js Ready não comprovam, isoladamente, resolução DNS ou HTTP 200 externos.

## Reproduzir sem credenciais

Com Node.js 22:

```sh
SMOKE_BASE_URL=https://logistica-web-production-cfbeefaa.up.railway.app node scripts/diagnose-public-health.mjs
```

O diagnóstico consulta o DNS do hostname e só depois invoca o contrato público `GET /api/health` por `scripts/smoke-health.mjs`. Saída JSON distingue `phase: dns` de `phase: http`, sem imprimir IPs, tokens, respostas privadas ou dados pessoais. Código de saída 0 indica sucesso; 1 indica falha DNS/HTTP; 2 indica configuração inválida. Não altera DNS, Railway ou aplicação.

**Interpretação:** `ENOTFOUND` ou `EAI_AGAIN` indica falha de resolução no ambiente executor, não necessariamente falha no Railway. Falha `phase: http` significa que o DNS resolveu, mas o contrato HTTP não foi validado. Comparar execuções de redes distintas e consultar o job `External public health smoke` do GitHub Actions antes de concluir indisponibilidade.

**Limitações:** o teste DNS usa o resolvedor do ambiente e não verifica propagação mundial, DNSSEC ou todas as regiões. O teste HTTP não substitui testes funcionais, de segurança, integração ou homologação. Não acionar integrações comerciais/financeiras reais.

**Rastreabilidade:** controle técnico de observabilidade conforme `AGENTS.md`, sem atribuição a jornada/tela/ação do Mestre v19. Matriz funcional continua `BLOQUEADO_POR_EVIDENCIA` (issue #1). Os totais documentais são 17 jornadas, 43 telas-base e 107 ações.
