(function () {
    "use strict";

    const config = window.CATALOGO_CONFIG;
    const service = window.CatalogService;
    let cachedProducts = [];
    let cachedCategories = [];

    const escapeHtml = (value = "") => value.toString().replace(/[&<>'"]/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"
    })[char]);

    const getSelection = () => {
        try {
            const value = JSON.parse(localStorage.getItem(config.selectionStorageKey) || "[]");
            return Array.isArray(value) ? value.filter(item => item && item.id) : [];
        } catch (_) {
            return [];
        }
    };

    const saveSelection = items => {
        localStorage.setItem(config.selectionStorageKey, JSON.stringify(items));
        refreshSelectionUI();
    };

    const findProduct = id => cachedProducts.find(product => product.id === id)
        || window.CATALOGO_DEMO.products.find(product => product.id === id);

    const addToSelection = (id, quantity = 1) => {
        const selection = getSelection();
        const existing = selection.find(item => item.id === id);
        if (existing) {
            existing.quantity = Math.max(1, Number(quantity) || existing.quantity || 1);
            showToast("Produto já está na sua seleção.", "info");
        } else {
            selection.push({ id, quantity: Math.max(1, Number(quantity) || 1) });
            showToast("Produto adicionado à seleção.", "success");
        }
        saveSelection(selection);
    };

    const removeFromSelection = id => {
        saveSelection(getSelection().filter(item => item.id !== id));
        showToast("Produto removido da seleção.", "info");
    };

    const updateSelectionQuantity = (id, quantity) => {
        const selection = getSelection();
        const item = selection.find(candidate => candidate.id === id);
        if (!item) return;
        item.quantity = Math.max(1, Number(quantity) || 1);
        saveSelection(selection);
    };

    const categoryName = categoryId => cachedCategories.find(category => category.id === categoryId)?.name
        || window.CATALOGO_DEMO.categories.find(category => category.id === categoryId)?.name
        || "Brindes";

    const productCard = product => `
        <article class="product-card" data-product-card data-product-id="${escapeHtml(product.id)}">
            <a class="product-card__image" href="produto.html?id=${encodeURIComponent(product.id)}" aria-label="Ver detalhes de ${escapeHtml(product.name)}">
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
                <span class="product-card__shade"></span>
                <div class="product-card__badges">
                    ${product.isNew ? '<span class="badge badge--new">Lançamento</span>' : ""}
                    ${product.featured && !product.isNew ? '<span class="badge">Destaque</span>' : ""}
                </div>
            </a>
            <div class="product-card__body">
                <div class="product-card__meta"><span>${escapeHtml(categoryName(product.category))}</span><small>${escapeHtml(product.code)}</small></div>
                <h3><a href="produto.html?id=${encodeURIComponent(product.id)}">${escapeHtml(product.name)}</a></h3>
                <p>${escapeHtml(product.shortDescription)}</p>
                <div class="product-card__actions">
                    <a class="product-card__details" href="produto.html?id=${encodeURIComponent(product.id)}">Ver detalhes <span aria-hidden="true">↗</span></a>
                    <button class="product-card__select" type="button" data-add-selection="${escapeHtml(product.id)}" aria-label="Adicionar ${escapeHtml(product.name)} à seleção"><span aria-hidden="true">＋</span><span class="product-card__select-label">Selecionar</span></button>
                </div>
            </div>
        </article>`;

    const categoryCard = (category, index) => `
        <a class="category-card reveal-up" href="catalogo.html?categoria=${encodeURIComponent(category.id)}" style="--delay:${index * 0.05}s">
            <img src="${escapeHtml(category.image)}" alt="${escapeHtml(category.name)}" loading="lazy">
            <span class="category-card__overlay"></span>
            <div class="category-card__content"><small>${String(index + 1).padStart(2, "0")}</small><h3>${escapeHtml(category.name)}</h3><p>${escapeHtml(category.description)}</p><span class="category-card__arrow" aria-hidden="true">↗</span></div>
        </a>`;

    const whatsappUrl = message => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;

    const showToast = (message, type = "info") => {
        let toast = document.querySelector(".site-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "site-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }
        toast.className = `site-toast site-toast--${type} is-visible`;
        toast.textContent = message;
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
    };

    const injectSelectionDrawer = () => {
        if (document.querySelector("#selection-drawer")) return;
        document.body.insertAdjacentHTML("beforeend", `
            <div class="selection-backdrop" data-close-selection></div>
            <aside class="selection-drawer" id="selection-drawer" aria-hidden="true" aria-labelledby="selection-title">
                <div class="selection-drawer__header">
                    <div><span class="eyebrow">Cotação personalizada</span><h2 id="selection-title">Minha seleção</h2></div>
                    <button type="button" data-close-selection aria-label="Fechar seleção">×</button>
                </div>
                <div class="selection-drawer__content" id="selection-content"></div>
                <div class="selection-drawer__footer">
                    <p>Os valores dependem da quantidade, personalização e disponibilidade.</p>
                    <button class="button button--primary button--full" type="button" id="send-selection">Enviar seleção pelo WhatsApp <span>↗</span></button>
                </div>
            </aside>`);
    };

    const renderSelection = () => {
        const content = document.querySelector("#selection-content");
        const sendButton = document.querySelector("#send-selection");
        if (!content || !sendButton) return;
        const selection = getSelection();

        if (!selection.length) {
            content.innerHTML = `<div class="selection-empty"><span>＋</span><h3>Sua seleção está vazia</h3><p>Adicione produtos do catálogo para enviar uma solicitação organizada.</p><a class="button button--ghost" href="catalogo.html">Explorar catálogo</a></div>`;
            sendButton.disabled = true;
            return;
        }

        sendButton.disabled = false;
        content.innerHTML = selection.map(item => {
            const product = findProduct(item.id);
            if (!product) return "";
            return `<article class="selection-item">
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
                <div class="selection-item__info"><small>${escapeHtml(product.code)}</small><strong>${escapeHtml(product.name)}</strong><label>Quantidade estimada <input type="number" min="1" value="${Math.max(1, item.quantity || 1)}" data-selection-quantity="${escapeHtml(product.id)}"></label></div>
                <button type="button" data-remove-selection="${escapeHtml(product.id)}" aria-label="Remover ${escapeHtml(product.name)}">×</button>
            </article>`;
        }).join("");
    };

    const refreshSelectionUI = () => {
        const selection = getSelection();
        document.querySelectorAll("[data-selection-count]").forEach(element => element.textContent = selection.length);
        document.querySelectorAll("[data-add-selection]").forEach(button => {
            const selected = selection.some(item => item.id === button.dataset.addSelection);
            button.classList.toggle("is-selected", selected);
            const label = button.querySelector(".product-card__select-label");
            if (label) label.textContent = selected ? "Selecionado" : "Selecionar";
        });
        renderSelection();
    };

    const openSelection = () => {
        renderSelection();
        document.querySelector("#selection-drawer")?.classList.add("is-open");
        document.querySelector(".selection-backdrop")?.classList.add("is-visible");
        document.querySelector("#selection-drawer")?.setAttribute("aria-hidden", "false");
        document.body.classList.add("drawer-open");
    };

    const closeSelection = () => {
        document.querySelector("#selection-drawer")?.classList.remove("is-open");
        document.querySelector(".selection-backdrop")?.classList.remove("is-visible");
        document.querySelector("#selection-drawer")?.setAttribute("aria-hidden", "true");
        document.body.classList.remove("drawer-open");
    };

    const sendSelection = () => {
        const selection = getSelection();
        if (!selection.length) return;
        const lines = selection.map((item, index) => {
            const product = findProduct(item.id);
            return product ? `${index + 1}. ${product.name} (${product.code}) — quantidade estimada: ${item.quantity || 1}` : "";
        }).filter(Boolean);
        const message = `Olá! Vim pelo catálogo virtual e gostaria de solicitar uma cotação para os seguintes produtos:\n\n${lines.join("\n")}\n\nGostaria de informações sobre valores, personalização e prazo.`;
        window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
    };

    const setupGlobalEvents = () => {
        const navToggle = document.querySelector(".nav-toggle");
        const nav = document.querySelector(".main-nav");
        navToggle?.addEventListener("click", () => {
            const open = nav?.classList.toggle("is-open");
            navToggle.classList.toggle("is-open", open);
            navToggle.setAttribute("aria-expanded", String(Boolean(open)));
        });
        nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            navToggle?.classList.remove("is-open");
            navToggle?.setAttribute("aria-expanded", "false");
        }));

        window.addEventListener("scroll", () => document.querySelector("#site-header")?.classList.toggle("is-scrolled", window.scrollY > 20), { passive: true });

        document.addEventListener("click", event => {
            const addButton = event.target.closest("[data-add-selection]");
            const removeButton = event.target.closest("[data-remove-selection]");
            if (addButton) addToSelection(addButton.dataset.addSelection);
            if (removeButton) removeFromSelection(removeButton.dataset.removeSelection);
            if (event.target.closest("[data-open-selection]")) openSelection();
            if (event.target.closest("[data-close-selection]")) closeSelection();
        });

        document.addEventListener("change", event => {
            if (event.target.matches("[data-selection-quantity]")) updateSelectionQuantity(event.target.dataset.selectionQuantity, event.target.value);
        });

        document.querySelector("#send-selection")?.addEventListener("click", sendSelection);
        document.addEventListener("keydown", event => { if (event.key === "Escape") closeSelection(); });

        document.querySelectorAll("[data-whatsapp-generic]").forEach(link => {
            link.href = whatsappUrl(config.whatsappMessage);
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });

        document.querySelectorAll("[data-admin-link]").forEach(link => {
            link.href = config.dashboardUrl;
            if (!config.dashboardUrl || config.dashboardUrl === "#") {
                link.addEventListener("click", event => {
                    event.preventDefault();
                    showToast("A área administrativa será conectada na próxima etapa do projeto.", "info");
                });
            }
        });

        document.querySelectorAll("[data-current-year]").forEach(element => element.textContent = new Date().getFullYear());
    };

    const animateVisibleContent = () => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!window.gsap || reduceMotion) {
            document.documentElement.classList.add("motion-ready");
            return;
        }

        window.gsap.registerPlugin(window.ScrollTrigger);
        document.documentElement.classList.add("motion-ready");

        if (document.body.dataset.page === "home") {
            const timeline = window.gsap.timeline({ defaults: { ease: "power3.out" } });
            timeline.from(".hero__eyebrow", { y: 20, opacity: 0, duration: 0.55 })
                .from(".hero h1", { y: 44, opacity: 0, duration: 0.8 }, "-=0.25")
                .from(".hero__content > p", { y: 24, opacity: 0, duration: 0.6 }, "-=0.48")
                .from(".hero__actions, .hero__trust", { y: 18, opacity: 0, duration: 0.55, stagger: 0.12 }, "-=0.35")
                .from(".hero__visual", { x: 45, opacity: 0, scale: 0.96, duration: 0.9 }, "-=0.85")
                .from(".hero__floating", { y: 18, opacity: 0, scale: 0.92, duration: 0.5, stagger: 0.12 }, "-=0.45");

            window.gsap.to("[data-parallax-visual]", {
                yPercent: 7,
                ease: "none",
                scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 }
            });
        }

        document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right").forEach(element => {
            const x = element.classList.contains("reveal-left") ? -44 : element.classList.contains("reveal-right") ? 44 : 0;
            window.gsap.from(element, { x, y: x ? 0 : 34, opacity: 0, duration: 0.75, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } });
        });

        animateCards();
    };

    const animateCards = (selector = "[data-product-card]") => {
        if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const cards = document.querySelectorAll(`${selector}:not([data-animated])`);
        cards.forEach(card => card.dataset.animated = "true");
        if (cards.length) {
            window.gsap.from(cards, { y: 32, opacity: 0, duration: 0.65, stagger: 0.07, ease: "power3.out", scrollTrigger: { trigger: cards[0], start: "top 90%", once: true } });
            window.ScrollTrigger?.refresh();
        }
    };

    const renderHome = async () => {
        const categoriesTarget = document.querySelector("#home-categories");
        const productsTarget = document.querySelector("#home-products");
        if (!categoriesTarget || !productsTarget) return;

        categoriesTarget.innerHTML = cachedCategories.map(categoryCard).join("");
        productsTarget.innerHTML = cachedProducts.filter(product => product.featured).slice(0, 8).map(productCard).join("");
        refreshSelectionUI();
    };

    const init = async () => {
        injectSelectionDrawer();
        [cachedProducts, cachedCategories] = await Promise.all([service.getProducts(), service.getCategories()]);
        setupGlobalEvents();
        if (document.body.dataset.page === "home") await renderHome();
        refreshSelectionUI();
        requestAnimationFrame(animateVisibleContent);
    };

    window.CatalogUI = Object.freeze({
        escapeHtml,
        productCard,
        categoryName,
        whatsappUrl,
        showToast,
        addToSelection,
        refreshSelectionUI,
        animateCards,
        getProducts: () => cachedProducts,
        getCategories: () => cachedCategories
    });

    document.addEventListener("DOMContentLoaded", init);
})();
