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
