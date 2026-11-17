# Registro de evidências e resolução de inconsistências

Este registro é técnico e interno ao desenvolvimento. Não exibir marcas de concorrentes nas telas, URLs de produto final ou material de marca.

| ID | Assunto | Evidência pública consultada | Decisão permitida | Limite / pendência |
|---|---|---|---|---|
| EV-001 | Busca geográfica de fretes | https://www.fretebras.com.br/fretes/ (consultado em 2026-11-16) | Busca com origem, destino opcional, raio de 50/100/200 km e filtros de veículo e carroceria | Regras da tela interna de publicação ainda exigem acesso autorizado |
| EV-002 | Jornada de motorista profissional | https://motoristapx.com.br/motoristas (consultado em 2026-11-16) | Candidatura ao contrato, prestação de serviço com veículo do contratante, checklist de encerramento | Fluxos privados e elegibilidade não confirmados |
| EV-003 | Créditos e pagamento profissional | https://motoristapx.com.br/termos-de-uso (consultado em 2026-11-16) | Registrar como referência documental de negócio, mantendo o pagamento profissional isolado do frete | Sem reproduzir operação financeira sem parceiro autorizado e revisão jurídica |

| EV-004 | Busca pública de fretes: filtros adicionais | https://www.fretebras.com.br/fretes/ e https://www.fretebras.com.br/dados-veiculo/ (consultados em 2026-11-17) | Planejar, apenas na busca de fretes, filtros independentes de tipo de carga (completa/complemento/agregamento), rastreador e agenciamento; manter origem, destino opcional e raio conforme EV-001 | Validar semântica, disponibilidade dos dados e testes antes de habilitar; não transportar filtros automaticamente para publicação ou contratação profissional |
| EV-005 | Contratação profissional sob demanda | https://motoristapx.com.br/empresas e https://motoristapx.com.br/termos-de-uso (consultados em 2026-11-17) | Tratar oferta de serviço, candidatura e seleção de profissional como jornada distinta de publicação/busca de frete | Não reproduzir promessas comerciais, elegibilidade, condições contratuais ou pagamento sem evidência específica e revisão autorizada |

## Critério de implementação com pesquisa concorrencial (2026-11-17)

Pesquisar os sites e termos oficiais antes de cada requisito ainda não comprovado; associar evidência, tela/jornada do Documento Mestre v19, decisão, PR e teste. Práticas públicas de UX e filtros podem ser implementadas com dados próprios e testes, desde que não contrariem o documento aprovado. Regras comerciais ou privadas continuam bloqueadas até confirmação. Evitar copiar código, marca, textos comerciais e ativos de terceiros. A pesquisa não substitui a versão controlada do Documento Mestre para garantir a rastreabilidade das 17 jornadas, 43 telas-base e 107 ações.

## Procedimento de decisão

**Para cada dúvida:** abrir issue com código da tela e ID da pendência P01–P22; descrever alternativas observadas sem adotar nenhuma; registrar links oficiais e data; identificar o que é confirmado, inferido ou desconhecido; registrar decisão e teste; fazer PR para alteração. Sem evidência, deixar bloqueado.

## Pendências do Documento Mestre

As pendências de negócio P01–P13 exigem confirmação de interfaces privadas, termos específicos, parceiros ou validação fiscal. P14–P22 têm critérios de engenharia documentados, porém **não** estão automaticamente implementados/testados. O fato de a documentação existir não significa que o produto esteja pronto.
