# Verificação HTTP não destrutiva da implantação

Fonte: Documento Mestre v19 e AGENTS.md, somente requisito técnico de disponibilidade. **Não altera qualquer jornada comercial.**

O Railway usa `/api/health` como healthcheck. Para testar a resposta pública depois de um deploy, executar:

```bash
SMOKE_BASE_URL=https://SEU-DOMINIO-CONFIRMADO npm run smoke:health
```

O script consulta exclusivamente `GET /api/health`, exige status 200, Content-Type JSON e o contrato `{status:'ok', service:'logistica-unificada'}`. Falha com código de saída não-zero, sem expor conteúdo de resposta ou segredos. Há timeout de 8 segundos, e redirects são rejeitados. Não usar domínio de produção como entrada de dados sensíveis. A checagem comprova somente disponibilidade básica do endpoint, não prontidão comercial, banco de dados, autenticação, pagamentos ou fluxos do Documento Mestre.

Os testes unitários simulam a resposta e não dependem de rede. A execução em produção deve ocorrer somente após deploy bem-sucedido e com URL confirmada.
