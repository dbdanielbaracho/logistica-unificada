# Instruções obrigatórias para desenvolvimento

## Fonte da verdade

1. O **Documento Mestre v19.0** (Documento_Mestre_Logistica_Unificada_v19_Diagnostico_e_Fechamento) é a referência funcional principal. A documentação posterior aprovada pelo proprietário substitui apenas as seções alteradas, preservando as demais.
2. Antes de alterar qualquer tela, rota, contrato, formulário ou regra, identificar a jornada e a tela (códigos E/C/M/H/G) no Mestre e indicar a seção correspondente no PR.
3. Preservar os quatro perfis: empresa, caminhoneiro com veículo, motorista sem veículo e ajudante. Preservar 17 jornadas numeradas, mapeamento de ações e todos os estados necessários de cada tela.
4. Minimizar passos sem remover obrigatoriedades; toda ação deve ter estado, resultado e destino documentados tanto na experiência web quanto na mobile.
5. Origem e destino são campos fundamentais para publicação e busca de fretes. A busca pública documenta destino opcional, raio 50/100/200 km, veículos e carrocerias; nunca transformar isso em regra universal de publicação sem prova.

## Divergências ou lacunas

1. Não inventar funcionalidade, regra de negócio, taxa, prazo, campo obrigatório, fornecedor ou método financeiro.
2. Em caso de inconsistência: (a) registrar a divergência; (b) consultar primeiro documentação, site e termos oficiais da plataforma de referência; (c) comparar versões e datas; (d) consultar normas oficiais quando aplicáveis; (e) registrar URLs, trechos resumidos, data da consulta e confiança em `docs/evidencias.md`; (f) implementar somente a parte confirmada.
3. Sem prova pública ou acesso autorizado, deixar explicitamente como `BLOQUEADO_POR_EVIDENCIA`, escrever critério de desbloqueio e não simular uma operação real.
4. Requisitos gerais de engenharia (validação, RBAC, logs seguros, LGPD, acessibilidade WCAG 2.2, OWASP ASVS) podem ser adotados como controles técnicos, sem alterar a regra comercial.
5. Não copiar código, marca, identidade visual, textos protegidos ou dados privados dos concorrentes. O produto utiliza identidade própria roxa.

## Financeiro — isolamento obrigatório

- Frete e serviço profissional são domínios distintos, com fluxos financeiros próprios, sujeitos à documentação original e homologação.
- Proibido inventar carteira híbrida, escrow, meio de pagamento, comissões, retenções, antecipações ou multas.
- Até integrações e contratos serem aprovados, interface, backend e dados devem indicar explicitamente operações reais desabilitadas.

## Qualidade e entrega

- Para cada mudança: registrar fonte do requisito, telas afetadas, destino dos botões, esquema de dados, validações, casos de erro, testes e impacto de segurança e privacidade.
- Não declarar pronto em produção sem teste de integração, homologação e evidência operacional no Railway.
- Não expor segredos, credenciais, dados reais de pessoas, tokens ou URLs internas no repositório público.
- Usar branches e PRs para futuras mudanças de negócio, preferindo testes automatizados e revisão antes de merge.
- Se Documento Mestre não estiver materializado neste repositório, solicitar ou ler a versão controlada antes de construir novas funcionalidades de negócio. **Este AGENTS.md não substitui o Documento Mestre.**
