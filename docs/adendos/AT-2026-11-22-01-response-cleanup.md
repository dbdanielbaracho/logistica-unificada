# AT-2026-11-22-01 — Liberação segura de respostas do monitor público

**Natureza:** correção técnica reversível do monitor de caminhos sensíveis; não altera o Documento Mestre v19 funcional.

## Defeito e decisão

O monitor `scripts/check-public-sensitive-paths.mjs` já exige HTTP 404 em três caminhos sintéticos e não lê o corpo da resposta. Antes desta correção, uma resposta diferente de 404 lançava exceção **antes** de cancelar o stream HTTP. Isso podia deixar recursos da conexão sem liberação explícita durante a falha do monitor.

A correção usa `finally` para cancelar o corpo tanto em 404 quanto em resposta inesperada, sem ler, registrar ou expor o conteúdo. Mantém timeout de 8 segundos, HTTPS, redirecionamentos proibidos, `no-store` e os dois jobs independentes existentes.

## Rastreabilidade e aceite

- Escopo: controle técnico de segurança da issue #53; nenhuma jornada/tela/ação de negócio modificada.
- Teste: `tests/check-public-sensitive-paths.test.mjs` comprova cancelamento para todos os 404 e para HTTP 200 inesperado, sem leitura de conteúdo.
- Aceite pendente: CI do PR e monitor externo efetivo nos dois domínios. Não confundir teste isolado, CI ou deployment SUCCESS com homologação funcional.
- Evidência de produção anterior (Railway, consultada em 2026-11-22): deployment `c449c226` SUCCESS, commit `f7c0d06e`; registros HTTP 200 para a página inicial e 404 para `/.env` e caminhos WordPress. Logs não demonstram conteúdo dos cabeçalhos ou execução integral dos seis probes.
- Referência operacional: https://github.com/dbdanielbaracho/logistica-unificada/pull/62
- Risco residual: falha de DNS/rede ou comportamento de proxy pode impedir a verificação externa; não reduzir controles de acesso nem ativar operações comerciais.

O inventário documental permanece **17 jornadas, 43 telas-base e 107 ações** sem percentuais funcionais auditados. Pagamentos, contratos e dados pessoais continuam sujeitos aos bloqueios existentes.
