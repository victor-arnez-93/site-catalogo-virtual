/*
 * CRV-CATALOGO-COMMERCE — BASE 1.0
 * Personalização principal por cliente.
 *
 * Mantenha dados de catálogo em dados-demo.js ou substitua o provider em
 * catalog-service.js quando houver banco de dados e área administrativa.
 */
window.CATALOGO_CONFIG = Object.freeze({
    mode: "demo",

    business: {
        slug: "catalogo-demonstracao",
        name: "Catálogo Demonstração",
        shortName: "CATÁLOGO DEMO",
        symbol: "C",
        descriptor: "por CRV Soluções em TI",
        description: "Uma vitrine digital adaptável a diferentes negócios.",
        whatsapp: "5515999999999",
        email: "contato@crvsolucoesemti.com.br",
        address: "Tatuí · São Paulo",
        businessHours: "Seg. a sex. · 8h às 18h"
    },

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

    catalog: {
        showPrices: true,
        showAvailability: true,
        variantsEnabled: true,
        whatsappCheckout: true,
        currency: "BRL",
        locale: "pt-BR"
    },

    admin: {
        enabled: false,
        dashboardUrl: "#"
    },

    messages: {
        whatsappGreeting: "Olá! Vim pelo catálogo virtual e gostaria de receber mais informações.",
        adminDemo: "A área administrativa é disponibilizada conforme o pacote contratado e pode controlar produtos, categorias e informações do catálogo."
    },

    storage: {
        selectionKey: "crv_catalogo_commerce_selecao_base_1_0"
    },

    supabase: {
        url: "",
        anonKey: ""
    }
});
