# Plataforma Logística Unificada

Código inicial público para construção da plataforma comercial de fretes, motoristas e ajudantes conforme Documento Mestre v19.

## Estado real

- Navegação responsiva para empresa, caminhoneiro, motorista e ajudante.
- Tela inicial de opções por perfil, sem execução de contratações.
- Endpoint de saúde /api/health e configuração Railway.
- **Ainda não existem banco de dados, autenticação, operações reais, aplicativos nativos ou integrações financeiras.**

**Pagamento de fretes e pagamento de contratos profissionais são fluxos separados.** Não habilitar contratos, publicações, pagamentos ou operações comerciais antes da implementação e homologação.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Testes

```bash
npm test
npm run lint
```
