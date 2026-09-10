/*
 * CRV-CATALOGO-COMMERCE — BASE 1.1
 * CONFIGURAÇÃO PRINCIPAL DO CATÁLOGO
 *
 * AVISO: revise esta configuração antes de publicar para um cliente.
 * Produtos e categorias ficam em dados-demo.js enquanto não houver banco.
 */
window.CATALOGO_CONFIG = Object.freeze({
    mode: "demo",

    /* IDENTIFICAÇÃO DA EMPRESA */

    business: {
        slug: "catalogo-demonstracao",
        name: "Catálogo Demonstração",
        shortName: "CATÁLOGO DEMO",
        symbol: "C",
        descriptor: "por CRV Soluções em TI",
        description: "Produtos organizados, informações claras e atendimento direto.",
        whatsapp: "5515999999999",
        email: "contato@crvsolucoesemti.com.br",
        address: "Tatuí · São Paulo",
        businessHours: "Seg. a sex. · 8h às 18h"
    },

    /* APRESENTAÇÃO COMERCIAL DA CRV */

    presentation: {
        showDemoBar: true,
        demoLabel: "Demonstração de catálogo virtual",
        demoMessage: "Conteúdo ilustrativo para apresentação",
        showCrvCredit: true
    },

    /* IDENTIDADE VISUAL */

    theme: {
        primary: "#003887",
        primaryDeep: "#001D49",
        primarySoft: "#315D91",
        secondary: "#D4A843",
        secondaryDark: "#A67E27",
        accent: "#7C6354",
        accentLight: "#E9E2DE",
        surface: "#FCFCFC"
    },

    /* RECURSOS DO CATÁLOGO */

    catalog: {
        showPrices: true,
        showAvailability: true,
        variantsEnabled: true,
        whatsappCheckout: true,
        currency: "BRL",
        locale: "pt-BR"
    },

    /* ÁREA ADMINISTRATIVA */

    admin: {
        enabled: false,
        dashboardUrl: "#"
    },

    /* MENSAGENS DE ATENDIMENTO */

    messages: {
        whatsappGreeting: "Olá! Vim pelo catálogo virtual e gostaria de receber mais informações.",
        adminDemo: "A área administrativa é disponibilizada conforme o pacote contratado e pode controlar produtos, categorias e informações do catálogo."
    },

    /* PERSISTÊNCIA LOCAL */

    storage: {
        selectionKey: "crv_catalogo_commerce_selecao_base_1_1"
    },

    /* INTEGRAÇÕES FUTURAS — NÃO PREENCHER SEM IMPLEMENTAÇÃO */

    supabase: {
        url: "",
        anonKey: ""
    }
});
