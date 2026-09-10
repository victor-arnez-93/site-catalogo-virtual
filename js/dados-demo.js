/*
 * DADOS ILUSTRATIVOS DO CATÁLOGO
 *
 * AVISO: substitua este conteúdo pelos dados do cliente antes da publicação.
 * Não altere os nomes das propriedades sem revisar catalog-service.js.
 */
window.CATALOGO_DEMO = Object.freeze({
    categories: [
        {
            id: "casa-rotina",
            name: "Casa & Rotina",
            shortName: "Casa",
            description: "Itens funcionais para uso diário, organização e decoração.",
            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=86"
        },
        {
            id: "moda-acessorios",
            name: "Moda & Acessórios",
            shortName: "Moda",
            description: "Produtos com opções de cores, tamanhos e modelos.",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=86"
        },
        {
            id: "papelaria-organizacao",
            name: "Papelaria & Organização",
            shortName: "Papelaria",
            description: "Soluções para estudo, trabalho e planejamento da rotina.",
            image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=86"
        },
        {
            id: "tecnologia",
            name: "Tecnologia",
            shortName: "Tecnologia",
            description: "Acessórios atuais com diferentes recursos e configurações.",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=86"
        },
        {
            id: "esporte-lazer",
            name: "Esporte & Lazer",
            shortName: "Esporte",
            description: "Produtos para movimento, bem-estar e momentos de lazer.",
            image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=86"
        }
    ],

    products: [
        {
            id: "caneca-nordic",
            name: "Caneca Nordic 350 ml",
            code: "CS-1042",
            category: "casa-rotina",
            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=88",
            gallery: [
                "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=88",
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=88"
            ],
            shortDescription: "Cerâmica com acabamento fosco e desenho minimalista.",
            description: "Caneca de cerâmica com linhas limpas, toque suave e acabamento fosco. Disponível em cores neutras e duas opções de capacidade para diferentes rotinas.",
            price: 49.9,
            priceNote: "Valor por unidade",
            availability: { status: "available", label: "Disponível" },
            specs: [
                { label: "Material", value: "Cerâmica" },
                { label: "Capacidade", value: "350 ml" },
                { label: "Acabamento", value: "Fosco" },
                { label: "Envio", value: "A combinar" }
            ],
            variants: [
                { id: "cor", name: "Cor", required: true, options: ["Areia", "Preto", "Verde", "Branco"] },
                { id: "capacidade", name: "Capacidade", required: true, options: ["250 ml", "350 ml"] }
            ],
            tags: ["uso diário", "mais vendido"],
            featured: true,
            isNew: false
        },
        {
            id: "luminaria-focus",
            name: "Luminária Focus",
            code: "CS-2180",
            category: "casa-rotina",
            image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=88",
            gallery: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=88"],
            shortDescription: "Iluminação direcionável para mesa ou cabeceira.",
            description: "Luminária compacta com foco direcionável para leitura, estudo ou trabalho. Escolha o acabamento e a voltagem antes de enviar sua seleção.",
            price: 129.9,
            priceNote: "Valor anunciado",
            availability: { status: "limited", label: "Últimas unidades" },
            specs: [
                { label: "Material", value: "Metal e polímero" },
                { label: "Altura", value: "42 cm" },
                { label: "Lâmpada", value: "LED inclusa" },
                { label: "Garantia", value: "12 meses" }
            ],
            variants: [
                { id: "acabamento", name: "Acabamento", required: true, options: ["Preto fosco", "Branco", "Dourado"] },
                { id: "voltagem", name: "Voltagem", required: true, options: ["127 V", "220 V"] }
            ],
            tags: ["decoração", "lançamento"],
            featured: false,
            isNew: true
        },
        {
            id: "camiseta-essencial",
            name: "Camiseta Essencial",
            code: "MD-3016",
            category: "moda-acessorios",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=88",
            gallery: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=88"],
            shortDescription: "Modelagem confortável em algodão de toque macio.",
            description: "Camiseta de algodão com modelagem regular e toque macio. Uma peça versátil, disponível em cores essenciais e tamanhos variados.",
            price: 69.9,
            priceNote: "Valor por unidade",
            availability: { status: "available", label: "Disponível" },
            specs: [
                { label: "Material", value: "Algodão" },
                { label: "Modelagem", value: "Regular" },
                { label: "Gramatura", value: "180 g/m²" },
                { label: "Cuidados", value: "Lavagem suave" }
            ],
            variants: [
                { id: "cor", name: "Cor", required: true, options: ["Branco", "Preto", "Azul"] },
                { id: "tamanho", name: "Tamanho", required: true, options: ["P", "M", "G", "GG"] }
            ],
            tags: ["cores", "tamanhos"],
            featured: true,
            isNew: false
        },
        {
            id: "mochila-nomad",
            name: "Mochila Nomad",
            code: "MD-4071",
            category: "moda-acessorios",
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=88",
            gallery: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=88"],
            shortDescription: "Organização interna e modelos para rotinas diferentes.",
            description: "Mochila resistente com compartimentos internos e espaço protegido para notebook. Consulte as opções de capacidade, modelo e cor disponíveis.",
            price: null,
            priceNote: "Valor sob consulta",
            availability: { status: "made-to-order", label: "Sob encomenda" },
            specs: [
                { label: "Material", value: "Poliéster resistente" },
                { label: "Capacidade", value: "18 a 25 litros" },
                { label: "Compartimento", value: "Notebook" },
                { label: "Prazo", value: "A consultar" }
            ],
            variants: [
                { id: "modelo", name: "Modelo", required: true, options: ["Compacta", "Executiva"] },
                { id: "cor", name: "Cor", required: true, options: ["Preto", "Cinza", "Azul-marinho"] }
            ],
            tags: ["sob consulta", "modelos"],
            featured: true,
            isNew: false
        },
        {
            id: "caderno-orbit",
            name: "Caderno Orbit",
            code: "PP-5014",
            category: "papelaria-organizacao",
            image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1200&q=88",
            gallery: ["https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1200&q=88"],
            shortDescription: "Capa rígida, elástico e miolo pautado.",
            description: "Caderno de capa rígida com fechamento por elástico e páginas pautadas. Disponível em duas medidas e acabamentos para estudo ou trabalho.",
            price: 54.9,
            priceNote: "Valor anunciado",
            availability: { status: "limited", label: "Estoque limitado" },
            specs: [
                { label: "Material", value: "Papel e capa rígida" },
                { label: "Páginas", value: "160 pautadas" },
                { label: "Encadernação", value: "Costurada" },
                { label: "Origem", value: "Nacional" }
            ],
            variants: [
                { id: "medida", name: "Medida", required: true, options: ["A5", "A6"] },
                { id: "acabamento", name: "Acabamento", required: true, options: ["Liso", "Texturizado"] }
            ],
            tags: ["organização", "medidas"],
            featured: true,
            isNew: false
        },
        {
            id: "fone-pulse",
            name: "Fone Bluetooth Pulse",
            code: "TC-6092",
            category: "tecnologia",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=88",
            gallery: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=88"],
            shortDescription: "Áudio sem fio com diferentes configurações.",
            description: "Fone sem fio com conexão estável, carregamento USB-C e autonomia para acompanhar a rotina. Escolha o modelo e a cor desejados.",
            price: 149.9,
            priceNote: "Valor anunciado",
            availability: { status: "available", label: "Disponível" },
            specs: [
                { label: "Conexão", value: "Bluetooth 5.3" },
                { label: "Autonomia", value: "Até 18 horas" },
                { label: "Carregamento", value: "USB-C" },
                { label: "Garantia", value: "12 meses" }
            ],
            variants: [
                { id: "modelo", name: "Modelo", required: true, options: ["Essencial", "Pro"] },
                { id: "cor", name: "Cor", required: true, options: ["Preto", "Branco"] }
            ],
            tags: ["tecnologia", "modelos"],
            featured: true,
            isNew: true
        },
        {
            id: "garrafa-flow",
            name: "Garrafa Flow",
            code: "EL-7025",
            category: "esporte-lazer",
            image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=88",
            gallery: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=88"],
            shortDescription: "Estrutura resistente e opções de capacidade.",
            description: "Garrafa de aço inox com tampa rosqueável e conservação térmica. Disponível em duas capacidades e diferentes opções de cor.",
            price: 89.9,
            priceNote: "Valor anunciado",
            availability: { status: "available", label: "Disponível" },
            specs: [
                { label: "Material", value: "Aço inox" },
                { label: "Conservação", value: "Até 8 horas" },
                { label: "Tampa", value: "Rosqueável" },
                { label: "Garantia", value: "90 dias" }
            ],
            variants: [
                { id: "capacidade", name: "Capacidade", required: true, options: ["500 ml", "750 ml"] },
                { id: "cor", name: "Cor", required: true, options: ["Preto", "Branco", "Azul", "Verde"] }
            ],
            tags: ["bem-estar", "capacidades"],
            featured: true,
            isNew: false
        },
        {
            id: "bola-training",
            name: "Bola Training",
            code: "EL-7188",
            category: "esporte-lazer",
            image: "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=1200&q=88",
            gallery: ["https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=1200&q=88"],
            shortDescription: "Modelos para treino e uso recreativo.",
            description: "Bola resistente para treinos e atividades recreativas. Consulte os modelos, medidas e prazo de disponibilidade antes de solicitar.",
            price: 119.9,
            priceNote: "Valor anunciado",
            availability: { status: "made-to-order", label: "Sob encomenda" },
            specs: [
                { label: "Material", value: "PU laminado" },
                { label: "Construção", value: "Costurada" },
                { label: "Uso", value: "Treino e lazer" },
                { label: "Prazo", value: "A consultar" }
            ],
            variants: [
                { id: "medida", name: "Medida", required: true, options: ["Nº 4", "Nº 5"] },
                { id: "modelo", name: "Modelo", required: true, options: ["Training", "Recreativa"] }
            ],
            tags: ["esporte", "sob encomenda"],
            featured: false,
            isNew: false
        },
        {
            id: "kit-selecao",
            name: "Kit Seleção",
            code: "KT-8020",
            category: "casa-rotina",
            image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=88",
            gallery: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=88"],
            shortDescription: "Composição personalizada com valor sob consulta.",
            description: "Conjunto montado sob consulta, com opções de composição e acabamento. Os detalhes, o prazo e o valor são confirmados durante o atendimento.",
            price: null,
            priceNote: "Valor sob consulta",
            availability: { status: "made-to-order", label: "Produção sob consulta" },
            specs: [
                { label: "Composição", value: "Personalizável" },
                { label: "Material", value: "Variado" },
                { label: "Acabamento", value: "Conforme projeto" },
                { label: "Prazo", value: "A consultar" }
            ],
            variants: [
                { id: "modelo", name: "Modelo", required: true, options: ["Essencial", "Completo"] },
                { id: "acabamento", name: "Acabamento", required: true, options: ["Clássico", "Premium"] }
            ],
            tags: ["personalizável", "sob consulta"],
            featured: false,
            isNew: true
        }
    ]
});
