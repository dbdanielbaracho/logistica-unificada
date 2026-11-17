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


## Implementação técnica em revisão (não incorporada à main)

- [ ] Módulo puro de validação de raio e destino opcionais da busca pública de fretes, fundamentado em EV-001; testes automatizados em PR separado, sem API, tela ou consulta operacional.

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
