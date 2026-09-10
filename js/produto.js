(function () {
    "use strict";

    const config = window.CATALOGO_CONFIG;

    const waitForUI = callback => {
        if (window.CatalogUI?.getProducts().length) callback();
        else setTimeout(() => waitForUI(callback), 30);
    };

    const notFound = () => {
        document.querySelector("#product-detail").innerHTML = `<div class="product-not-found"><span>⌕</span><h1>Produto não encontrado</h1><p>O item pode ter sido removido ou o endereço está incompleto.</p><a class="button button--primary" href="catalogo.html">Voltar ao catálogo</a></div>`;
    };

    const renderSpecs = product => (product.specs || []).map(spec => `
        <div><small>${window.CatalogUI.escapeHtml(spec.label)}</small><strong>${window.CatalogUI.escapeHtml(spec.value)}</strong></div>`).join("");

    const renderVariants = product => {
        if (!config.catalog.variantsEnabled || !product.variants?.length) return "";
        return `<div class="product-variants">
            <div class="product-variants__heading"><small>Escolha as opções</small><span>Os campos marcados são obrigatórios.</span></div>
            <div class="product-variants__grid">
                ${product.variants.map(variant => `
                    <label>
                        <span>${window.CatalogUI.escapeHtml(variant.name)}${variant.required ? " *" : ""}</span>
                        <select data-product-variant data-variant-name="${window.CatalogUI.escapeHtml(variant.name)}" ${variant.required ? "required" : ""}>
                            <option value="">Selecione</option>
                            ${variant.options.map(option => `<option value="${window.CatalogUI.escapeHtml(option)}">${window.CatalogUI.escapeHtml(option)}</option>`).join("")}
                        </select>
                    </label>`).join("")}
            </div>
        </div>`;
    };

    const collectVariants = () => {
        const result = {};
        const fields = [...document.querySelectorAll("[data-product-variant]")];
        const invalid = fields.find(field => field.required && !field.value);
        if (invalid) {
            window.CatalogUI.showToast(`Selecione: ${invalid.dataset.variantName}.`, "info");
            invalid.focus();
            return null;
        }
        fields.forEach(field => {
            if (field.value) result[field.dataset.variantName] = field.value;
        });
        return result;
    };

    const textVariantSummary = variants => Object.entries(variants)
        .map(([name, value]) => `${name}: ${value}`)
        .join(" · ");

    const renderProduct = async product => {
        const category = window.CatalogUI.categoryName(product.category);
        const gallery = [...new Set([product.image, ...(product.gallery || [])])];
        const showPrice = config.catalog.showPrices;
        const showAvailability = config.catalog.showAvailability && product.availability;
        document.title = `${product.name} | ${config.business.name}`;
        document.querySelector("#product-breadcrumbs").innerHTML = `<a href="index.html">Início</a><span>/</span><a href="catalogo.html?categoria=${encodeURIComponent(product.category)}">${window.CatalogUI.escapeHtml(category)}</a><span>/</span><strong>${window.CatalogUI.escapeHtml(product.name)}</strong>`;

        document.querySelector("#product-detail").innerHTML = `
            <div class="product-layout">
                <div class="product-gallery">
                    <div class="product-gallery__main"><img id="product-main-image" src="${window.CatalogUI.escapeHtml(gallery[0])}" alt="${window.CatalogUI.escapeHtml(product.name)}"><div class="product-gallery__badges">${product.isNew ? '<span class="badge badge--new">Novidade</span>' : ""}${product.featured ? '<span class="badge">Destaque</span>' : ""}</div></div>
                    ${gallery.length > 1 ? `<div class="product-gallery__thumbs">${gallery.map((image, index) => `<button type="button" class="${index === 0 ? "is-active" : ""}" data-gallery-image="${window.CatalogUI.escapeHtml(image)}" aria-label="Ver imagem ${index + 1}"><img src="${window.CatalogUI.escapeHtml(image)}" alt=""></button>`).join("")}</div>` : ""}
                </div>

                <div class="product-info">
                    <div class="product-info__top"><span>${window.CatalogUI.escapeHtml(category)}</span><small>Ref. ${window.CatalogUI.escapeHtml(product.code)}</small></div>
                    <h1>${window.CatalogUI.escapeHtml(product.name)}</h1>
                    <p class="product-info__lead">${window.CatalogUI.escapeHtml(product.description)}</p>
                    <div class="product-tags">${(product.tags || []).map(tag => `<span>${window.CatalogUI.escapeHtml(tag)}</span>`).join("")}</div>

                    <div class="product-commercial">
                        ${showPrice ? `<div class="product-commercial__price"><small>Valor</small><strong>${window.CatalogUI.escapeHtml(window.CatalogUI.formatPrice(product.price))}</strong><span>${window.CatalogUI.escapeHtml(product.priceNote || "")}</span></div>` : ""}
                        ${showAvailability ? `<div class="product-commercial__availability"><small>Disponibilidade</small><strong class="product-availability product-availability--${window.CatalogUI.escapeHtml(product.availability.status)}">${window.CatalogUI.escapeHtml(product.availability.label)}</strong></div>` : ""}
                    </div>

                    <div class="product-specs">${renderSpecs(product)}</div>
                    ${renderVariants(product)}

                    <div class="product-quote">
                        <div class="product-quote__heading"><div><strong>Adicionar à seleção</strong><small>Defina a quantidade e, se quiser, deixe uma observação.</small></div><label>Quantidade <span class="quantity-control"><button type="button" data-quantity-minus aria-label="Diminuir quantidade">−</button><input id="quote-quantity" type="number" min="1" value="1"><button type="button" data-quantity-plus aria-label="Aumentar quantidade">＋</button></span></label></div>
                        <label class="product-quote__note">Observação opcional<textarea id="quote-note" rows="2" placeholder="Ex.: preferência de prazo, acabamento ou outra informação..."></textarea></label>
                        <div class="product-quote__actions">
                            <button class="button button--primary" type="button" id="product-whatsapp">Enviar pelo WhatsApp <span>↗</span></button>
                            <button class="button button--ghost" type="button" id="product-selection">Adicionar à seleção <span>＋</span></button>
                        </div>
                        <p class="product-quote__disclaimer">O envio da seleção não conclui a compra. Disponibilidade, condições e entrega são confirmadas durante o atendimento.</p>
                    </div>
                </div>
            </div>`;

        document.querySelectorAll("[data-gallery-image]").forEach(button => button.addEventListener("click", () => {
            document.querySelector("#product-main-image").src = button.dataset.galleryImage;
            document.querySelectorAll("[data-gallery-image]").forEach(item => item.classList.remove("is-active"));
            button.classList.add("is-active");
        }));

        const quantityInput = document.querySelector("#quote-quantity");
        document.querySelector("[data-quantity-minus]").addEventListener("click", () => { quantityInput.value = Math.max(1, Number(quantityInput.value || 1) - 1); });
        document.querySelector("[data-quantity-plus]").addEventListener("click", () => { quantityInput.value = Math.max(1, Number(quantityInput.value || 1) + 1); });
        quantityInput.addEventListener("change", () => { quantityInput.value = Math.max(1, Number(quantityInput.value || 1)); });

        document.querySelector("#product-selection").addEventListener("click", () => {
            const variants = collectVariants();
            if (variants === null) return;
            const note = document.querySelector("#quote-note").value.trim();
            window.CatalogUI.addToSelection(product.id, quantityInput.value, variants, note);
        });

        document.querySelector("#product-whatsapp").addEventListener("click", () => {
            const variants = collectVariants();
            if (variants === null) return;
            const note = document.querySelector("#quote-note").value.trim();
            const details = [
                `Produto: ${product.name}`,
                `Referência: ${product.code}`,
                `Quantidade: ${quantityInput.value}`,
                textVariantSummary(variants) ? `Variações: ${textVariantSummary(variants)}` : "",
                showPrice ? `Valor exibido: ${window.CatalogUI.formatPrice(product.price)}` : "",
                note ? `Observação: ${note}` : "",
                `Link: ${window.location.href}`
            ].filter(Boolean).join("\n");
            const message = `Olá! Vim pelo catálogo virtual e tenho interesse neste produto.\n\n${details}\n\nGostaria de confirmar disponibilidade, condições e próximos passos.`;
            window.open(window.CatalogUI.whatsappUrl(message), "_blank", "noopener,noreferrer");
        });

        const related = await window.CatalogService.getRelatedProducts(product, 4);
        if (related.length) {
            document.querySelector("#related-section").hidden = false;
            document.querySelector("#related-products").innerHTML = related.map(window.CatalogUI.productCard).join("");
            window.CatalogUI.refreshSelectionUI();
            requestAnimationFrame(() => window.CatalogUI.animateCards("#related-products [data-product-card]"));
        }

        if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            window.gsap.from(".product-gallery", { x: -35, opacity: 0, duration: 0.75, ease: "power3.out" });
            window.gsap.from(".product-info > *", { y: 24, opacity: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" });
        }
    };

    waitForUI(async () => {
        const id = new URLSearchParams(window.location.search).get("id");
        if (!id) return notFound();
        const product = await window.CatalogService.getProductById(id);
        if (!product) return notFound();
        await renderProduct(product);
    });
})();
