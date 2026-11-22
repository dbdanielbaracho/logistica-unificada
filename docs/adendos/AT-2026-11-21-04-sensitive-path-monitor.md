# AT-2026-11-21-04 — Verificação externa de caminhos sensíveis

Status: proposta técnica em PR; não altera o Documento Mestre v19 funcional.

## Origem e escopo
Issue #53, AGENTS.md e docs/implementacao.md. Controles gerais de segurança, sem jornada/tela/ação comercial afetada. Inventário documental permanece 17 jornadas, 43 telas-base e 107 ações, **não auditadas funcionalmente**.

## Decisão técnica
Adicionar verificação externa isolada de status HTTP 404 para três caminhos sintéticos representativos (arquivo de ambiente, metadados Git e configuração de agente), executada nos dois domínios já monitorados. Usar HTTPS, URLs fixas, sem credenciais, sem redirecionamentos, sem cache, timeout e sem leitura ou publicação de corpos, IPs ou segredos. Falhar o job diante de qualquer status diferente de 404. Testes locais com fetch simulado; nenhum dado privado é necessário.

## Critérios de aceite e riscos
1. Quality gates aprovados e PR incorporado.
2. Execução externa agendada/manual comprovada para ambos os domínios.
3. Status 404 não comprova ausência universal de exposição, cabeçalhos ou segurança de outros caminhos. Issue #53 só pode ser fechada após evidência suficiente de todos os seus critérios.
4. Se o domínio apresentar 403 ou 308 legítimo, registrar a divergência e revisar a política antes de modificar o contrato, nunca mascarar o erro.
5. Não ativar pagamentos, contratos, fretes reais, contratação profissional nem dados pessoais.

## Referências
- Issue #53: https://github.com/dbdanielbaracho/logistica-unificada/issues/53
- Controle OWASP de exposição de arquivos: https://owasp.org/www-project-web-security-testing-guide/
- Workflow do projeto: .github/workflows/external-health.yml

Esta mudança é um controle técnico reversível, não uma inferência sobre funcionalidades dos concorrentes.
