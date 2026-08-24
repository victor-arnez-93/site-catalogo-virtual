(function () {
    "use strict";

    const state = { search: "", category: "todos", sort: "featured" };

    const waitForUI = callback => {
        if (window.CatalogUI?.getProducts().length) callback();
        else setTimeout(() => waitForUI(callback), 30);
    };

    const setCategoryFromUrl = categories => {
        const value = new URLSearchParams(window.location.search).get("categoria");
        if (value && categories.some(category => category.id === value)) state.category = value;
    };

    const renderFilters = categories => {
        const target = document.querySelector("#category-filters");
        target.innerHTML = `<button type="button" class="category-chip ${state.category === "todos" ? "is-active" : ""}" data-category="todos">Todos</button>`
            + categories.map(category => `<button type="button" class="category-chip ${state.category === category.id ? "is-active" : ""}" data-category="${category.id}">${window.CatalogUI.escapeHtml(category.shortName || category.name)}</button>`).join("");
    };

    const filteredProducts = products => {
        const normalizedSearch = window.CatalogService.normalize(state.search);
        const filtered = products.filter(product => {
            const matchesCategory = state.category === "todos" || product.category === state.category;
            const searchTarget = window.CatalogService.normalize([product.name, product.code, product.shortDescription, product.materials, ...(product.tags || [])].join(" "));
            return matchesCategory && (!normalizedSearch || searchTarget.includes(normalizedSearch));
        });

        return filtered.sort((a, b) => {
            if (state.sort === "name-asc") return a.name.localeCompare(b.name, "pt-BR");
            if (state.sort === "newest") return Number(b.isNew) - Number(a.isNew) || a.name.localeCompare(b.name, "pt-BR");
            return Number(b.featured) - Number(a.featured) || Number(b.isNew) - Number(a.isNew) || a.name.localeCompare(b.name, "pt-BR");
        });
    };

    const renderProducts = products => {
        const result = filteredProducts(products);
        const grid = document.querySelector("#catalog-products");
        const empty = document.querySelector("#catalog-empty");
        document.querySelector("#catalog-count").textContent = result.length;
        grid.innerHTML = result.map(window.CatalogUI.productCard).join("");
        grid.hidden = !result.length;
        empty.hidden = Boolean(result.length);
        window.CatalogUI.refreshSelectionUI();
        requestAnimationFrame(() => window.CatalogUI.animateCards("#catalog-products [data-product-card]"));
    };

    const syncUrl = () => {
        const url = new URL(window.location.href);
        if (state.category === "todos") url.searchParams.delete("categoria");
        else url.searchParams.set("categoria", state.category);
        window.history.replaceState({}, "", url);
    };

    const reset = (products, categories) => {
        state.search = "";
        state.category = "todos";
        state.sort = "featured";
        document.querySelector("#catalog-search").value = "";
        document.querySelector("#catalog-sort").value = "featured";
        renderFilters(categories);
        renderProducts(products);
        syncUrl();
    };

    waitForUI(() => {
        const products = window.CatalogUI.getProducts();
        const categories = window.CatalogUI.getCategories();
        setCategoryFromUrl(categories);
        renderFilters(categories);
        renderProducts(products);

        document.querySelector("#category-filters").addEventListener("click", event => {
            const chip = event.target.closest("[data-category]");
            if (!chip) return;
            state.category = chip.dataset.category;
            renderFilters(categories);
            renderProducts(products);
            syncUrl();
        });

        document.querySelector("#catalog-search").addEventListener("input", event => {
            state.search = event.target.value;
            renderProducts(products);
        });

        document.querySelector("#catalog-search").addEventListener("keydown", event => {
            if (event.key === "Escape") {
                event.target.value = "";
                state.search = "";
                renderProducts(products);
            }
        });

        document.querySelector("#catalog-sort").addEventListener("change", event => {
            state.sort = event.target.value;
            renderProducts(products);
        });

        document.querySelector("#clear-filters").addEventListener("click", () => reset(products, categories));
        document.querySelector("[data-reset-catalog]").addEventListener("click", () => reset(products, categories));
    });
})();
