# AT-2026-11-23-02 — Catálogo de caminhos sensíveis

Data: 2026-11-23. Escopo: controle técnico da issue #53, sem alteração de telas ou jornadas do Mestre v19.

## Lacuna e decisão
O PR #54 contém uma verificação de unicidade e formato do catálogo de caminhos sensíveis que ainda não constava como teste específico na main. A maior parte do PR #54 já foi incorporada por PRs posteriores; sua aplicação integral geraria conflitos e duplicações. Preservar somente a verificação útil em um teste independente, sem modificar o helper de produção.

## Critérios e evidência
Fonte interna: `scripts/check-sensitive-paths.mjs`, `tests/security-sensitive-paths-http.test.mjs`, PR #54 (https://github.com/dbdanielbaracho/logistica-unificada/pull/54), consultados em 2026-11-23. O teste exige catálogo congelado, entradas únicas, caminhos absolutos sem segmentos de travessia, execução sem redirects e ausência de corpo de resposta nos resultados. A execução de CI é necessária para aceitar o PR.

## Limites e riscos
O teste é isolado, usa respostas sintéticas e não demonstra proteção do domínio público nem ausência de exposição em produção. Nenhuma operação financeira, contratual, pessoal ou comercial é ativada. Escopo documental permanece 17 jornadas, 43 telas-base e 107 ações, sem percentuais funcionais auditados.
