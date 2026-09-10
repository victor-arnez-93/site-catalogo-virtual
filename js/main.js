(function () {
    "use strict";

    const config = window.CATALOGO_CONFIG;
    const service = window.CatalogService;
    const business = config.business;
    const catalogConfig = config.catalog;
    const presentation = config.presentation || {};
    let cachedProducts = [];
    let cachedCategories = [];
    let lastSelectionTrigger = null;

    const escapeHtml = (value = "") => value.toString().replace(/[&<>'"]/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"
    })[char]);

    const formatPrice = price => {
        if (price === null || price === undefined || price === "") return "Sob consulta";
        return new Intl.NumberFormat(catalogConfig.locale, {
            style: "currency",
            currency: catalogConfig.currency
        }).format(Number(price));
    };

    const applySiteConfig = () => {
        /* CORES CONFIGURÁVEIS DO CLIENTE */

        const themeMap = {
            "--ink": config.theme.primary,
            "--ink-deep": config.theme.primaryDeep,
            "--ink-soft": config.theme.primarySoft,
            "--orange": config.theme.secondary,
            "--orange-dark": config.theme.secondaryDark,
            "--sage": config.theme.accent,
            "--sage-light": config.theme.accentLight,
            "--paper": config.theme.surface
        };
        Object.entries(themeMap).forEach(([property, value]) => document.documentElement.style.setProperty(property, value));

        const textBindings = {
            "[data-business-name]": business.name,
            "[data-business-short-name]": business.shortName,
            "[data-business-symbol]": business.symbol,
            "[data-business-descriptor]": business.descriptor,
            "[data-business-description]": business.description,
            "[data-business-address]": business.address,
            "[data-business-hours]": business.businessHours
        };
        Object.entries(textBindings).forEach(([selector, value]) => {
            document.querySelectorAll(selector).forEach(element => { element.textContent = value; });
        });

        /* ELEMENTOS EXCLUSIVOS DA DEMONSTRAÇÃO */

        document.querySelectorAll("[data-demo-label]").forEach(element => {
            element.textContent = presentation.demoLabel || "Demonstração de catálogo virtual";
        });
        document.querySelectorAll("[data-demo-message]").forEach(element => {
            element.textContent = presentation.demoMessage || "Conteúdo ilustrativo para apresentação";
        });
        const showDemoBar = config.mode === "demo" && presentation.showDemoBar !== false;
        document.querySelectorAll("[data-demo-bar]").forEach(element => {
            element.hidden = !showDemoBar;
        });
        document.querySelectorAll("[data-crv-credit]").forEach(element => {
            element.hidden = presentation.showCrvCredit === false;
        });

        document.querySelectorAll("[data-business-email]").forEach(link => {
            link.textContent = business.email;
            link.href = `mailto:${business.email}`;
        });
        document.querySelectorAll("[data-brand-home]").forEach(link => {
            link.setAttribute("aria-label", `${business.name} - Página inicial`);
        });

        const pageNames = {
            home: business.name,
            catalogo: `Catálogo | ${business.name}`,
            produto: `Produto | ${business.name}`
        };
        document.title = pageNames[document.body.dataset.page] || business.name;
    };

    /* AVISOS DE CONFIGURAÇÃO NO CONSOLE */

    const logConfigurationStatus = () => {
        const prefix = "[CRV Catálogo]";

        console.info(`${prefix} Interface carregada com sucesso.`);

        if (config.mode === "demo") {
            console.info(`${prefix} Modo demonstração ativo.`);
        }

        if (!business.whatsapp || business.whatsapp === "5515999999999") {
            console.warn(`${prefix} AVISO: substitua o WhatsApp demonstrativo em js/config.js antes da publicação.`);
        }

        if (!config.admin.enabled) {
            console.info(`${prefix} Área administrativa desativada nesta versão.`);
        }
    };

    const normalizeSelection = value => Array.isArray(value)
        ? value.filter(item => item && item.id).map(item => ({
            uid: item.uid || item.id,
            id: item.id,
            quantity: Math.max(1, Number(item.quantity) || 1),
            variants: item.variants && typeof item.variants === "object" ? item.variants : {},
            note: typeof item.note === "string" ? item.note : ""
        }))
        : [];

    const getSelection = () => {
        try {
            return normalizeSelection(JSON.parse(localStorage.getItem(config.storage.selectionKey) || "[]"));
        } catch (_) {
            return [];
        }
    };

    const saveSelection = items => {
        try {
            localStorage.setItem(config.storage.selectionKey, JSON.stringify(items));
        } catch (_) {
            showToast("Não foi possível salvar a seleção neste navegador.", "info");
        }
        refreshSelectionUI();
    };

    const findProduct = id => cachedProducts.find(product => product.id === id)
        || window.CATALOGO_DEMO.products.find(product => product.id === id);

    const selectionUid = (id, variants = {}) => {
        const normalized = Object.entries(variants)
            .sort(([first], [second]) => first.localeCompare(second))
            .map(([key, value]) => `${key}:${value}`)
            .join("|");
        return `${id}::${encodeURIComponent(normalized)}`;
    };

    const addToSelection = (id, quantity = 1, variants = {}, note = "") => {
        const selection = getSelection();
        const uid = selectionUid(id, variants);
        const existing = selection.find(item => item.uid === uid);
        if (existing) {
            existing.quantity = Math.max(1, Number(quantity) || existing.quantity || 1);
            existing.note = note || existing.note;
            showToast("As informações deste item foram atualizadas.", "info");
        } else {
            selection.push({
                uid,
                id,
                quantity: Math.max(1, Number(quantity) || 1),
                variants,
                note
            });
            showToast("Produto adicionado à seleção.", "success");
        }
        saveSelection(selection);
        return true;
    };

    const removeFromSelection = uid => {
        saveSelection(getSelection().filter(item => item.uid !== uid));
        showToast("Produto removido da seleção.", "info");
    };

    const updateSelectionQuantity = (uid, quantity) => {
        const selection = getSelection();
        const item = selection.find(candidate => candidate.uid === uid);
        if (!item) return;
        item.quantity = Math.max(1, Number(quantity) || 1);
        saveSelection(selection);
    };

    const categoryName = categoryId => cachedCategories.find(category => category.id === categoryId)?.name
        || window.CATALOGO_DEMO.categories.find(category => category.id === categoryId)?.name
        || "Catálogo";

    const availabilityMarkup = product => {
        if (!catalogConfig.showAvailability || !product.availability) return "";
        return `<span class="product-availability product-availability--${escapeHtml(product.availability.status)}">${escapeHtml(product.availability.label)}</span>`;
    };

    const priceMarkup = product => {
        if (!catalogConfig.showPrices) return "";
        return `<div class="product-card__price"><strong>${escapeHtml(formatPrice(product.price))}</strong>${product.priceNote ? `<small>${escapeHtml(product.priceNote)}</small>` : ""}</div>`;
    };

    const productAction = product => {
        const hasVariants = catalogConfig.variantsEnabled && Array.isArray(product.variants) && product.variants.length;
        if (hasVariants) {
            return `<a class="product-card__select" href="produto.html?id=${encodeURIComponent(product.id)}" aria-label="Escolher opções de ${escapeHtml(product.name)}"><span aria-hidden="true">＋</span><span class="product-card__select-label">Escolher</span></a>`;
        }
        return `<button class="product-card__select" type="button" data-add-selection="${escapeHtml(product.id)}" aria-label="Adicionar ${escapeHtml(product.name)} à seleção"><span aria-hidden="true">＋</span><span class="product-card__select-label">Selecionar</span></button>`;
    };

    const productCard = product => `
        <article class="product-card" data-product-card data-product-id="${escapeHtml(product.id)}">
            <a class="product-card__image" href="produto.html?id=${encodeURIComponent(product.id)}" aria-label="Ver detalhes de ${escapeHtml(product.name)}">
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
                <span class="product-card__shade"></span>
                <div class="product-card__badges">
                    ${product.isNew ? '<span class="badge badge--new">Novidade</span>' : ""}
                    ${product.featured && !product.isNew ? '<span class="badge">Destaque</span>' : ""}
                </div>
            </a>
            <div class="product-card__body">
                <div class="product-card__meta"><span>${escapeHtml(categoryName(product.category))}</span><small>${escapeHtml(product.code)}</small></div>
                <h3><a href="produto.html?id=${encodeURIComponent(product.id)}">${escapeHtml(product.name)}</a></h3>
                <p>${escapeHtml(product.shortDescription)}</p>
                <div class="product-card__commercial">${priceMarkup(product)}${availabilityMarkup(product)}</div>
                <div class="product-card__actions">
                    <a class="product-card__details" href="produto.html?id=${encodeURIComponent(product.id)}">Ver detalhes <span aria-hidden="true">↗</span></a>
                    ${productAction(product)}
                </div>
            </div>
        </article>`;

    const categoryCard = (category, index) => `
        <a class="category-card reveal-up" href="catalogo.html?categoria=${encodeURIComponent(category.id)}" style="--delay:${index * 0.05}s">
            <img src="${escapeHtml(category.image)}" alt="${escapeHtml(category.name)}" loading="lazy">
            <span class="category-card__overlay"></span>
            <div class="category-card__content"><small>${String(index + 1).padStart(2, "0")}</small><h3>${escapeHtml(category.name)}</h3><p>${escapeHtml(category.description)}</p><span class="category-card__arrow" aria-hidden="true">↗</span></div>
        </a>`;

    const whatsappUrl = message => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;

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
                    <div><span class="eyebrow">Atendimento pelo WhatsApp</span><h2 id="selection-title">Minha seleção</h2></div>
                    <button type="button" data-close-selection aria-label="Fechar seleção">×</button>
                </div>
                <div class="selection-drawer__content" id="selection-content"></div>
                <div class="selection-drawer__footer">
                    <p>Revise os itens antes de iniciar o atendimento.</p>
                    <button class="button button--primary button--full" type="button" id="send-selection">Enviar seleção pelo WhatsApp <span>↗</span></button>
                </div>
            </aside>`);
    };

    const variantSummary = variants => Object.entries(variants || {})
        .map(([name, value]) => `<span><b>${escapeHtml(name)}:</b> ${escapeHtml(value)}</span>`)
        .join("");

    const renderSelection = () => {
        const content = document.querySelector("#selection-content");
        const sendButton = document.querySelector("#send-selection");
        if (!content || !sendButton) return;
        const selection = getSelection();

        if (!selection.length) {
            content.innerHTML = `<div class="selection-empty"><span>＋</span><h3>Sua seleção está vazia</h3><p>Escolha produtos e variações para enviar uma solicitação organizada.</p><a class="button button--ghost" href="catalogo.html">Explorar catálogo</a></div>`;
            sendButton.disabled = true;
            return;
        }

        sendButton.disabled = false;
        content.innerHTML = selection.map(item => {
            const product = findProduct(item.id);
            if (!product) return "";
            return `<article class="selection-item">
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
                <div class="selection-item__info">
                    <small>${escapeHtml(product.code)}</small>
                    <strong>${escapeHtml(product.name)}</strong>
                    <div class="selection-item__variants">${variantSummary(item.variants)}</div>
                    ${catalogConfig.showPrices ? `<span class="selection-item__price">${escapeHtml(formatPrice(product.price))}</span>` : ""}
                    ${item.note ? `<p class="selection-item__note">${escapeHtml(item.note)}</p>` : ""}
                    <label>Quantidade <input type="number" min="1" value="${item.quantity}" data-selection-quantity="${escapeHtml(item.uid)}"></label>
                </div>
                <button type="button" data-remove-selection="${escapeHtml(item.uid)}" aria-label="Remover ${escapeHtml(product.name)}">×</button>
            </article>`;
        }).join("");
    };

    const refreshSelectionUI = () => {
        const selection = getSelection();
        document.querySelectorAll("[data-selection-count]").forEach(element => { element.textContent = selection.length; });
        document.querySelectorAll("[data-add-selection]").forEach(button => {
            const selected = selection.some(item => item.id === button.dataset.addSelection);
            button.classList.toggle("is-selected", selected);
            const label = button.querySelector(".product-card__select-label");
            if (label) label.textContent = selected ? "Selecionado" : "Selecionar";
        });
        renderSelection();
    };

    const openSelection = trigger => {
        lastSelectionTrigger = trigger || document.activeElement;
        renderSelection();
        document.querySelector("#selection-drawer")?.classList.add("is-open");
        document.querySelector(".selection-backdrop")?.classList.add("is-visible");
        document.querySelector("#selection-drawer")?.setAttribute("aria-hidden", "false");
        document.body.classList.add("drawer-open");
        document.querySelector("#selection-drawer [data-close-selection]")?.focus();
    };

    const closeSelection = () => {
        document.querySelector("#selection-drawer")?.classList.remove("is-open");
        document.querySelector(".selection-backdrop")?.classList.remove("is-visible");
        document.querySelector("#selection-drawer")?.setAttribute("aria-hidden", "true");
        document.body.classList.remove("drawer-open");
        if (lastSelectionTrigger instanceof HTMLElement) lastSelectionTrigger.focus();
    };

    const textVariantSummary = variants => Object.entries(variants || {})
        .map(([name, value]) => `${name}: ${value}`)
        .join(" · ");

    const sendSelection = () => {
        const selection = getSelection();
        if (!selection.length || !catalogConfig.whatsappCheckout) return;
        const lines = selection.map((item, index) => {
            const product = findProduct(item.id);
            if (!product) return "";
            const details = [
                `${index + 1}. ${product.name} (${product.code})`,
                `Quantidade: ${item.quantity}`,
                textVariantSummary(item.variants) ? `Variações: ${textVariantSummary(item.variants)}` : "",
                catalogConfig.showPrices ? `Valor exibido: ${formatPrice(product.price)}` : "",
                item.note ? `Observação: ${item.note}` : ""
            ].filter(Boolean);
            return details.join("\n");
        }).filter(Boolean);
        const message = `Olá! Vim pelo catálogo virtual e tenho interesse nos itens abaixo:\n\n${lines.join("\n\n")}\n\nGostaria de confirmar disponibilidade, condições e próximos passos.`;
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
            if (event.target.closest("[data-open-selection]")) openSelection(event.target.closest("[data-open-selection]"));
            if (event.target.closest("[data-close-selection]")) closeSelection();
        });

        document.addEventListener("change", event => {
            if (event.target.matches("[data-selection-quantity]")) updateSelectionQuantity(event.target.dataset.selectionQuantity, event.target.value);
        });

        document.querySelector("#send-selection")?.addEventListener("click", sendSelection);
        document.addEventListener("keydown", event => { if (event.key === "Escape") closeSelection(); });

        document.querySelectorAll("[data-whatsapp-generic]").forEach(link => {
            link.href = whatsappUrl(config.messages.whatsappGreeting);
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });

        document.querySelectorAll("[data-admin-link]").forEach(link => {
            link.href = config.admin.dashboardUrl;
            if (!config.admin.enabled || !config.admin.dashboardUrl || config.admin.dashboardUrl === "#") {
                link.addEventListener("click", event => {
                    event.preventDefault();
                    showToast(config.messages.adminDemo, "info");
                });
            }
        });

        document.querySelectorAll("[data-current-year]").forEach(element => { element.textContent = new Date().getFullYear(); });
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
        cards.forEach(card => { card.dataset.animated = "true"; });
        if (cards.length) {
            window.gsap.from(cards, { y: 32, opacity: 0, duration: 0.65, stagger: 0.07, ease: "power3.out", scrollTrigger: { trigger: cards[0], start: "top 90%", once: true } });
            window.ScrollTrigger?.refresh();
        }
    };

    /* CARROSSÉIS DA PÁGINA INICIAL */

    const setupCarousels = () => {
        document.querySelectorAll("[data-carousel]").forEach(carousel => {
            const track = carousel.querySelector("[data-carousel-track]");
            const previousButton = carousel.querySelector("[data-carousel-previous]");
            const nextButton = carousel.querySelector("[data-carousel-next]");

            if (!track || !previousButton || !nextButton) return;

            const updateButtons = () => {
                const maximumScroll = Math.max(0, track.scrollWidth - track.clientWidth);
                const hasOverflow = maximumScroll > 2;

                carousel.classList.toggle("has-overflow", hasOverflow);
                previousButton.disabled = !hasOverflow || track.scrollLeft <= 2;
                nextButton.disabled = !hasOverflow || track.scrollLeft >= maximumScroll - 2;
            };

            const move = direction => {
                const firstCard = track.firstElementChild;
                const styles = window.getComputedStyle(track);
                const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
                const distance = firstCard ? firstCard.getBoundingClientRect().width + gap : track.clientWidth;

                track.scrollBy({
                    left: direction * distance,
                    behavior: "smooth"
                });
            };

            previousButton.addEventListener("click", () => move(-1));
            nextButton.addEventListener("click", () => move(1));
            track.addEventListener("scroll", updateButtons, { passive: true });
            window.addEventListener("resize", updateButtons, { passive: true });

            requestAnimationFrame(updateButtons);
        });
    };

    const renderHome = async () => {
        const categoriesTarget = document.querySelector("#home-categories");
        const productsTarget = document.querySelector("#home-products");
        if (!categoriesTarget || !productsTarget) return;

        categoriesTarget.innerHTML = cachedCategories.map(categoryCard).join("");
        productsTarget.innerHTML = cachedProducts.filter(product => product.featured).slice(0, 8).map(productCard).join("");
        refreshSelectionUI();
        setupCarousels();
    };

    const init = async () => {
        applySiteConfig();
        injectSelectionDrawer();
        [cachedProducts, cachedCategories] = await Promise.all([service.getProducts(), service.getCategories()]);
        setupGlobalEvents();
        if (document.body.dataset.page === "home") await renderHome();
        refreshSelectionUI();
        logConfigurationStatus();
        requestAnimationFrame(animateVisibleContent);
    };

    window.CatalogUI = Object.freeze({
        escapeHtml,
        formatPrice,
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
