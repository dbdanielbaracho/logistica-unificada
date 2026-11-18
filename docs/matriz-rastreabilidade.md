# Matriz de rastreabilidade — estrutura controlada (não preenchida)

**Estado: BLOQUEADO_POR_EVIDENCIA (issue #1).** Este arquivo é somente um modelo de controle. Não substitui o Documento Mestre v19.0, não afirma que as 17 jornadas, 43 telas-base ou 107 ações estejam implementadas e não presume códigos, requisitos ou destinos.

## Fonte de verdade e autorização

- Fonte funcional: Documento Mestre v19.0 aprovado e atualizações formalmente aprovadas.
- A versão integral deve permanecer em repositório **privado/autorizado**, se contiver conteúdo não destinado à publicação. Registrar aqui somente identificador não sensível, versão, aprovação e referência segura; **não** incluir tokens, URLs internas, dados pessoais nem contratos privados.
- Antes de preencher uma linha, conferir a seção e o código da jornada/tela na fonte controlada; usar evidências públicas oficiais quando houver divergência, conforme AGENTS.md e docs/evidencias.md.

## Campos obrigatórios da matriz de controle (metadados, não campos de produto)

| Versão/seção aprovada | Jornada (código) | Tela (código) | Formulário/estado | Ação (código) | Destino/resultado | Requisito | Evidência/decisão | PR/commit | Teste | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| Aguardando versão controlada | NÃO VERIFICADO | NÃO VERIFICADO | NÃO VERIFICADO | NÃO VERIFICADO | NÃO VERIFICADO | NÃO VERIFICADO | Issue #1 | — | — | BLOQUEADO_POR_EVIDENCIA |

## Critérios de preenchimento e aceite

1. Uma linha por relação rastreável **verificada** entre jornada, tela, estado, ação e destino; não gerar linhas artificiais para atingir contagens.
2. Registrar vínculo de cada linha com requisito do Mestre, evidência, implementação, teste e resultado de homologação; marcar explicitamente o que ainda não existe.
3. Os totais **17 jornadas / 43 telas-base / 107 ações** são apenas inventário documental; conferir cobertura contra a fonte aprovada, sem assumir que cada tela possui apenas uma ação.
4. Status permitidos neste controle: `BLOQUEADO_POR_EVIDENCIA`, `PENDENTE`, `IMPLEMENTADO_NAO_HOMOLOGADO`, `HOMOLOGADO`. Só usar `HOMOLOGADO` com testes, deploy e evidência operacional pertinentes.
5. Manter domínios de fretes e contratos profissionais separados. Não preencher regras financeiras por analogia; exigir contratos, integrações e homologação antes de habilitar operações reais.
6. Desbloqueio da issue #1 exige versão controlada autorizada e matriz revisada integralmente; este modelo sozinho **não** resolve a issue.
