# Controle de implementação vinculado ao Documento Mestre

Referência obrigatória: Documento Mestre v19.0, 43 telas-base, 17 jornadas e 107 ações especificadas. **São números do inventário documental, não do software entregue.**

## Implementado e incorporado à branch `main`

- [x] Navegação inicial responsiva com seleção de quatro perfis, sem autenticação real
- [x] Interface inicial em português e identidade própria
- [x] Endpoint público `GET /api/health`
- [x] Implantação da aplicação Next.js no Railway
- [x] GitHub Actions: testes automatizados, checagem de tipos e build de produção (PR #2)
- [x] Testes da navegação inicial e dos avisos de operações bloqueadas (PR #4)
- [x] Cabeçalhos defensivos de segurança HTTP e teste correspondente (PR #3)
- [x] Smoke test de saúde com timeout, JSON esperado e redirects recusados (PR #5)
- [x] Smoke test recusa credenciais embutidas na URL e cobre erros adicionais (PR #6)
- [x] Testes HTTP de integração local para o monitor público, incluindo redirecionamento, JSON inválido e status 503 (PR #8)
- [x] Validação exata de tipo MIME JSON para o monitor de saúde (PR #9)
- [x] Resposta de saúde sem cache e teste de regressão do cabeçalho HTTP (PRs #10 e #11)
- [x] Requisições do monitor de saúde com política `cache: no-store` (PR #12)
- [x] Testes de isolamento da rota pública: caminhos privados, credenciais e protocolos não HTTP (PR #13)
- [x] Link de salto acessível e foco em títulos após navegação (PRs #17–#19)
- [x] Registro de evidências públicas de filtros de fretes e contratos profissionais (PR #20; documentação, não implementação)
- [x] Teste automatizado do catálogo para separar destinos de fretes, motoristas e ajudantes e verificar placeholders (PR #21; teste de catálogo, não jornada homologada)


- [x] Validador isolado de raio 50/100/200 km e destino opcional para busca pública de fretes, com testes automatizados (PR #24; EV-001). **Sem interface, API, dados reais ou busca operacional.**

- [x] Testes de borda do validador público de fretes: imutabilidade, espaços Unicode, preservação de pontuação e rejeição de coerções implícitas (PRs #27–#29; sem busca real)
- [x] Composição pura e imutável dos filtros públicos documentados de raio e destino opcionais (PR #30; sem API ou interface)
- [x] Guarda estrita reutilizável de raios públicos documentados, com testes de tipos incompatíveis (PR #31; CI Quality gates #59 aprovado; deploy ainda sujeito a confirmação independente)

- [x] Auditor de rastreabilidade: bloqueio de estados conflitantes para a mesma relação e exigência de referências a PR/commit e teste para HOMOLOGADO (PR #39, commit `3058e6cb`, CI Quality gates #77 aprovado; Railway deployment `f3c8f969` SUCCESS em 2026-11-18). **É controle técnico, não homologação das 17 jornadas, 43 telas ou 107 ações.**
- [ ] Smoke HTTP externo do deployment `f3c8f969`: domínio Railway identificado, mas requisição externa não comprovada nesta execução (falha de resolução DNS no ambiente de verificação); logs do servidor indicam `Ready in 888ms`, o que não substitui o smoke HTTP.


- [x] Auditor de rastreabilidade: bloqueio de homologação fictícia e de identificadores em linhas `NÃO VERIFICADO` (PR #41, commit `3ec38b33`; Railway deployment `3611b6cd` SUCCESS em 2026-11-18). **Não comprova conclusão funcional.**
- [x] Auditor de rastreabilidade: rejeição de estado, destino e requisito inventados em linhas `NÃO VERIFICADO`, com teste de regressão (PR #42, commit `7156ab10`; Quality gates #83 SUCCESS no PR; Railway deployment `eaabdc39-a65d-4e3c-a03b-01950b272e9f` SUCCESS em 2026-11-19, réplica 1/1 ativa e `Ready in 357ms`). **Não comprova conclusão funcional.**
- [ ] Smoke HTTP externo do deployment `eaabdc39`: não comprovado em 2026-11-19; stream HTTP do Railway retornou 0 registros na consulta. Estado SUCCESS e log Ready não substituem requisição HTTP externa.

## Não implementado ou não homologado

- [ ] Versão integral controlada do Documento Mestre no fluxo de engenharia, com rastreabilidade jornada → tela → ação → teste (issue #1)
- [ ] Cadastro e autenticação reais; proteção de dados pessoais e permissões por perfil
- [ ] 43 telas-base e todas as subtelas/estados conforme Mestre
- [ ] 17 jornadas completas e 107 ações reais com testes de integração
- [ ] Banco de dados, migrações, autorização e auditoria transacional
- [ ] Publicação e pesquisa reais de fretes com origem, destino e filtros documentados
- [ ] Busca de caminhões, candidaturas, seleção e contratos
- [ ] Etapas e encerramento de viagens e serviços
- [ ] Integrações financeiras isoladas e homologadas para fretes e serviços profissionais
- [ ] Documentos fiscais e conciliação homologados
- [ ] Testes E2E web/mobile, acessibilidade, segurança e performance
- [ ] Aplicativos móveis nativos e distribuição homologada

## Critérios de prontidão

**Infraestrutura online não equivale a plataforma comercial pronta.** CI verde e healthcheck 200 apenas validam aspectos técnicos limitados.

Antes de habilitar cada jornada: identificar seção e versão do Mestre, mapear telas e ações com seus destinos, implementar persistência e controles de acesso, testar casos de erro, verificar fontes oficiais de concorrentes quando houver divergência e obter homologação das integrações necessárias.

Nenhum método financeiro, tarifa ou condição comercial poderá ser inferido. Fluxos de frete e contratação profissional continuam separados e indisponíveis até homologação.

**Regra de encerramento:** declarar funcionalidade concluída somente com código, testes, implantação e evidência contratual/regulatória pertinente.

## Diagnóstico DNS/HTTP externo — 2026-11-19 (PR em revisão)

- [ ] Diagnóstico de rede proposto em `scripts/diagnose-public-health.mjs`, com testes de DNS, falha HTTP e URL inválida (`tests/diagnose-public-health.test.mjs`); ainda sujeito a CI, merge e comprovação operacional. Procedimento: `docs/diagnostico-health-publico.md`.
- [ ] Smoke HTTP externo 200/JSON no ambiente público: **não comprovado**; deployment SUCCESS não é evidência equivalente. Não alterar DNS nem ativar operação real com base apenas neste diagnóstico.
- [ ] Matriz funcional permanece `BLOQUEADO_POR_EVIDENCIA` (issue #1); não contabilizar 17/43/107 como entregues.


## Domínio público personalizado — 2026-11-19

- [x] Domínio `lu.predibeacon.com` associado ao serviço `logistica-web`, ambiente production, Railway projeto `dd17098d-570e-47e9-a311-b97c0c55b14d`.
- [x] Verificação de propriedade confirmada pela API Railway (`verified: true`); certificado HTTPS `CERTIFICATE_STATUS_TYPE_VALID`.
- [x] PR #46 incorporado na main, commit `daa39507f145939cc47ef2a9832863e158bdcb27`; deployment `dce2d63f-2e1f-4218-85b1-66853eae40d4` SUCCESS. Diagnóstico isolado em `scripts/diagnose-public-health.mjs`.
- [ ] A consulta Railway ainda sinaliza `DNS_RECORD_STATUS_REQUIRES_UPDATE` para CNAME `lu`, mesmo com domínio verificado e certificado válido; verificar resolução pública por executor independente e resultado do smoke HTTP 200/JSON antes de homologar disponibilidade externa.
- [ ] Matriz funcional e Mestre v19 integral: pendência issue #1; os totais 17 jornadas, 43 telas-base e 107 ações são escopo documental, sem percentuais auditáveis.

Esta atualização é apenas documental e de observabilidade; não altera jornadas, rotas comerciais, contratos, pagamentos ou tratamento de dados pessoais.


## Monitoramento do domínio personalizado — adendo AT-2026-11-19-01

- [ ] PR técnico: incluir `lu.predibeacon.com` como segundo alvo independente do monitor agendado de `/api/health`, preservando domínio Railway original e testes sem segredos.
- [ ] Comprovar Quality gates e execução externa agendada/manual do contrato JSON em ambos os domínios antes de marcar operação externa como validada.
- [ ] Documento Mestre v19 funcional e matriz issue #1 permanecem sem alteração de escopo e sem percentual funcional auditado.

Referência: `docs/adendos/AT-2026-11-19-01-monitor-dominio.md`.


## Monitor público com jobs independentes — adendo AT-2026-11-19-02

- [x] PR #51 incorporado (`4be3f09c`): separar Railway e domínio personalizado em jobs independentes para que falha de um não impeça a execução do outro; ambos devem contribuir para status de falha do workflow.
- [ ] Aceite: testes automatizados, Quality gates aprovado, merge e execução externa verificada separadamente.
- [ ] Matriz funcional do Mestre v19 continua `BLOQUEADO_POR_EVIDENCIA` (issue #1); sem impacto em jornadas, telas, ações, contratos, pagamentos ou dados pessoais.

Referência: `docs/adendos/AT-2026-11-19-02-independent-health-jobs.md`.

## Regressão do contrato público de saúde — AT-2026-11-19-03 (PR #52)

- [x] PR #52 incorporado (`525b7e5f`): testes de contrato HTTP/JSON, URL fixa, rejeição de protocolos/credenciais e opções seguras de fetch. Adendo: `docs/adendos/AT-2026-11-19-03.md`.
- [x] Merge do PR #52 confirmado; testes simulados não comprovam monitor externo nem homologam funcionalidades do Mestre v19. A issue #1 permanece bloqueada.

## Segurança de caminhos sensíveis — reaplicação sobre main (2026-11-20)

- [x] Código e testes isolados incorporados via PR #56 (`4388f8d2`) a partir da main após PRs #52 e #55; regressões para 404, redirecionamentos, falhas HTTP, timeouts e ausência de conteúdo sensível nos resultados.
- [x] CI Quality gates #122 SUCCESS e merge do PR #56 confirmados em 2026-11-20; testes isolados não equivalem à homologação operacional. O PR #54 original permanece aberto e em conflito, preservado para comparação histórica.
- [ ] Smoke HTTPS e cabeçalhos efetivos do deployment público ainda não homologados por estes testes isolados; issue #53 permanece aberta.
- [ ] Documento Mestre v19 integral, 17 jornadas, 43 telas-base e 107 ações continuam não auditados; issue #1 e bloqueios financeiros preservados.

Referência: `docs/adendos/AT-2026-11-19-04-security-sensitive-paths.md`.

## Reconciliação auditada de GitHub e Railway — 2026-11-20 (18h29 BRT)

- `main` no commit `4388f8d2ff47c6720d54f30d1de85f0940f56b25`; PRs #51, #52, #55 e #56 incorporados. PR #54 ainda aberto, não incorporado diretamente; alterações de segurança reaplicadas pelo #56, sem presumir equivalência integral dos diffs.
- Railway `logistica-web` (production): deployment `2b3027e4-f073-44c3-83e2-4ffb13484e48` `SUCCESS`, mesmo commit da `main`, sem alterações de configuração staged. Logs mostram `Ready in 412ms`; o SIGTERM registrado corresponde ao encerramento de container durante substituição, não a prova de incidente no container atual.
- Amostra de 101 registros HTTP consultados: 20 respostas 200, 63 respostas 404 e 18 respostas 308. Sondagens observadas de `/.env` e `/.git/HEAD` responderam 404; não extrapolar para auditoria completa. `robots.txt` e `sitemap.xml` responderam 404 na amostra: não tratar automaticamente como defeito, pois a política de indexação ainda depende de decisão documentada.
- **Pendente:** teste HTTPS independente com status, cabeçalhos e corpo JSON esperado de `/api/health` nos dois domínios; verificar issue #53 sem registrar IPs, segredos ou corpos sensíveis. Issue #1 mantém bloqueada a homologação das 17 jornadas, 43 telas-base e 107 ações, que são apenas inventário documental.
- Histórico acima preservado intencionalmente; itens antigos com status de PR em revisão representam o estado à época, não o estado atual. Nenhuma operação financeira, contrato ou fluxo real foi habilitado por esta reconciliação.


## Evidência externa independente — 2026-11-20, execução #5

- [x] [External public health smoke #5](https://github.com/dbdanielbaracho/logistica-unificada/actions/runs/44840761398), iniciado em 2026-11-20 23:59:47 UTC: SUCCESS nos dois jobs independentes (domínio personalizado e domínio Railway), inclusive etapas de contrato público.
- [x] O workflow .github/workflows/external-health.yml executa scripts/smoke-health.mjs separadamente contra https://lu.predibeacon.com e https://logistica-web-production-cfbeefaa.up.railway.app. Logs HTTP Railway: GET /api/health retornou 200 nos dois hosts às 23:59:53 e 23:59:55 UTC. Evidência válida para esta execução, não disponibilidade permanente.
- [x] Deployment dae89f99-2e25-4844-8b18-94ce71688223, commit c07bad8999f7fe752845c7dd433cb21aafdfb39b: SUCCESS, réplica 1/1 online, nenhuma falha recente, sem mudanças staged (consulta 2026-11-21 00:28 UTC).
- [ ] Cabeçalhos efetivos e todos os caminhos sensíveis em HTTPS público continuam não homologados (issue #53); healthcheck não substitui auditoria de segurança.
- [ ] Mestre v19 integral e rastreabilidade funcional continuam pendentes (issue #1). 17 jornadas, 43 telas-base e 107 ações são escopo documental, sem percentuais auditados.

Atualização exclusivamente documental; não altera telas, APIs, pagamentos, contratos ou dados pessoais.

## Monitoramento externo de cabeçalhos — AT-2026-11-21-02 (PR em revisão)

- [x] Código do verificador isolado de cabeçalhos HTTP incorporado anteriormente via PR #59 (`a1fd09d5`); a existência do código não comprova execução externa.
- [ ] PR técnico desta alteração: executar `scripts/check-public-security-headers.mjs` após o smoke de saúde nos **dois jobs independentes** do workflow agendado `external-health.yml`, com falha explícita se qualquer cabeçalho divergir.
- [ ] Aceite pendente: Quality gates do PR, merge e execução externa real nos dois domínios com resultados e URLs verificáveis; issue #53 permanece aberta até evidência suficiente.
- [ ] Issue #1: Mestre v19 integral e rastreabilidade das 17 jornadas, 43 telas-base e 107 ações continuam sem auditoria de conclusão; não apresentar percentual fictício.

Referência: `docs/adendos/AT-2026-11-21-02-monitor-headers.md`. Esta alteração é somente de monitoramento; não habilita operação comercial, pagamento, contrato ou uso de dados pessoais.


## Regressão automatizada do monitor de cabeçalhos — AT-2026-11-21-03

- [x] Teste de contrato de workflow criado em branch/PR: exige que cada domínio público tenha job independente com smoke de saúde e verificação de cabeçalhos, sem segredos ou supressão de falhas. Referência: `tests/external-security-monitor-workflow.test.mjs`.
- [ ] Aceite do PR: CI aprovado, merge e execução do monitor externo na versão integrada. Teste estático não substitui validação HTTPS real (issue #53).
- [ ] Auditoria das 17 jornadas, 43 telas-base e 107 ações continua bloqueada pela ausência da fonte integral controlada do Mestre v19 (issue #1). Nenhuma porcentagem funcional atribuída.

Adendo: `docs/adendos/AT-2026-11-21-03-monitor-regression.md`.

## Verificação externa de caminhos sensíveis — AT-2026-11-21-04 (PR em revisão)

- [ ] Proposta: script `scripts/check-public-sensitive-paths.mjs` com três sondagens sintéticas e testes isolados, executado independentemente nos dois jobs do monitor público.
- [ ] Exigir CI aprovado, merge e execução externa comprovada antes de marcar verificação operacional. Status 404 em três caminhos não equivale a auditoria completa nem fecha automaticamente a issue #53.
- [ ] Issue #1 e rastreabilidade funcional continuam bloqueadas: 17 jornadas, 43 telas-base e 107 ações são inventário documental, não percentual desenvolvido.
- [ ] Nenhuma rota comercial, integração financeira, contrato ou dado pessoal foi habilitado.

Referência: `docs/adendos/AT-2026-11-21-04-sensitive-path-monitor.md`.
