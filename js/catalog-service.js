(function () {
    "use strict";

    const normalize = (value = "") => value
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    const copy = value => JSON.parse(JSON.stringify(value));

    const demoProvider = {
        async getCategories() {
            return copy(window.CATALOGO_DEMO.categories);
        },

        async getProducts() {
            return copy(window.CATALOGO_DEMO.products);
        },

        async getProductById(id) {
            const product = window.CATALOGO_DEMO.products.find(item => item.id === id);
            return product ? copy(product) : null;
        },

        async getRelatedProducts(product, limit = 4) {
            return copy(window.CATALOGO_DEMO.products
                .filter(item => item.id !== product.id && item.category === product.category)
                .concat(window.CATALOGO_DEMO.products.filter(item => item.id !== product.id && item.featured))
                .filter((item, index, array) => array.findIndex(candidate => candidate.id === item.id) === index)
                .slice(0, limit));
        }
    };

    /*
     * Esta camada isola o front-end da fonte de dados.
     * Na versão SaaS, o provider abaixo será trocado por consultas ao Supabase,
     * sempre filtradas pelo companySlug e protegidas por RLS.
     */
    const provider = demoProvider;

    window.CatalogService = Object.freeze({
        normalize,
        getCategories: () => provider.getCategories(),
        getProducts: () => provider.getProducts(),
        getProductById: id => provider.getProductById(id),
        getRelatedProducts: (product, limit) => provider.getRelatedProducts(product, limit)
    });
})();
