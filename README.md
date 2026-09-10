# CRV-CATALOGO-COMMERCE — BASE 1.0

Base oficial e reutilizável da CRV Soluções em TI para projetos de catálogo virtual.

## Escopo desta versão

- catálogo responsivo com página inicial, listagem e detalhes;
- categorias, busca e ordenação;
- produtos com preço opcional e valor sob consulta;
- disponibilidade;
- variações genéricas por produto;
- seleção persistida no navegador;
- envio organizado para WhatsApp;
- indicação da área administrativa como módulo comercial futuro.

Esta versão não inclui autenticação, painel administrativo funcional, banco de dados, checkout, pagamento, frete ou infraestrutura SaaS.

## Personalização por cliente

As informações principais ficam em `js/config.js`:

- `business`: nome, marca, WhatsApp, e-mail, endereço e horário;
- `theme`: cores do cliente;
- `catalog`: exibição de preço, disponibilidade, variações e WhatsApp;
- `admin`: ativação e endereço da área administrativa;
- `storage`: chave usada para persistir a seleção;
- `supabase`: espaço reservado para uma futura integração, sem conexão ativa.

Os produtos e categorias demonstrativos ficam em `js/dados-demo.js`. Cada produto pode utilizar qualquer conjunto de variações, como cor, tamanho, modelo, material, acabamento, capacidade, medida ou voltagem.

## Evolução comercial

- Pacote A: catálogo virtual e atendimento pelo WhatsApp.
- Pacote B: catálogo, WhatsApp e área administrativa conforme escopo.
- Pacote C: evolução para e-commerce, com módulos adicionados somente quando contratados.

Para uma versão com banco e múltiplas empresas, mantenha a interface atual e substitua o provider demonstrativo de `js/catalog-service.js` por uma fonte protegida, filtrada pela empresa ativa.

## Execução local

O projeto é estático e não possui dependências. Sirva a pasta por um servidor HTTP local e abra `index.html`. Abrir os arquivos diretamente pelo navegador também funciona na maioria dos casos, mas um servidor local representa melhor o ambiente de publicação.
