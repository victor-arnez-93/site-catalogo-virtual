(function () {
    "use strict";

    const waitForUI = callback => {
        if (window.CatalogUI?.getProducts().length) callback();
        else setTimeout(() => waitForUI(callback), 30);
    };

    const colorList = colors => colors.map(color => `<span>${window.CatalogUI.escapeHtml(color)}</span>`).join("");

    const notFound = () => {
        document.querySelector("#product-detail").innerHTML = `<div class="product-not-found"><span>⌕</span><h1>Produto não encontrado</h1><p>O item pode ter sido removido ou o endereço está incompleto.</p><a class="button button--primary" href="catalogo.html">Voltar ao catálogo</a></div>`;
    };

    const renderProduct = async product => {
        const category = window.CatalogUI.categoryName(product.category);
        const gallery = [...new Set([product.image, ...(product.gallery || [])])];
        document.title = `${product.name} | Sua Marca Brindes`;
        document.querySelector("#product-breadcrumbs").innerHTML = `<a href="index.html">Início</a><span>/</span><a href="catalogo.html?categoria=${encodeURIComponent(product.category)}">${window.CatalogUI.escapeHtml(category)}</a><span>/</span><strong>${window.CatalogUI.escapeHtml(product.name)}</strong>`;

        document.querySelector("#product-detail").innerHTML = `
            <div class="product-layout">
                <div class="product-gallery">
                    <div class="product-gallery__main"><img id="product-main-image" src="${window.CatalogUI.escapeHtml(gallery[0])}" alt="${window.CatalogUI.escapeHtml(product.name)}"><div class="product-gallery__badges">${product.isNew ? '<span class="badge badge--new">Lançamento</span>' : ""}${product.featured ? '<span class="badge">Destaque</span>' : ""}</div></div>
                    ${gallery.length > 1 ? `<div class="product-gallery__thumbs">${gallery.map((image, index) => `<button type="button" class="${index === 0 ? "is-active" : ""}" data-gallery-image="${window.CatalogUI.escapeHtml(image)}" aria-label="Ver imagem ${index + 1}"><img src="${window.CatalogUI.escapeHtml(image)}" alt=""></button>`).join("")}</div>` : ""}
                </div>

                <div class="product-info">
                    <div class="product-info__top"><span>${window.CatalogUI.escapeHtml(category)}</span><small>Ref. ${window.CatalogUI.escapeHtml(product.code)}</small></div>
                    <h1>${window.CatalogUI.escapeHtml(product.name)}</h1>
                    <p class="product-info__lead">${window.CatalogUI.escapeHtml(product.description)}</p>
                    <div class="product-tags">${(product.tags || []).map(tag => `<span>${window.CatalogUI.escapeHtml(tag)}</span>`).join("")}</div>

                    <div class="product-specs">
                        <div><small>Material</small><strong>${window.CatalogUI.escapeHtml(product.materials)}</strong></div>
                        <div><small>Medidas / capacidade</small><strong>${window.CatalogUI.escapeHtml(product.dimensions)}</strong></div>
                        <div><small>Personalização</small><strong>${window.CatalogUI.escapeHtml(product.personalization)}</strong></div>
                        <div><small>Quantidade mínima</small><strong>${window.CatalogUI.escapeHtml(product.minQuantity)}</strong></div>
                    </div>

                    <div class="product-colors"><small>Cores disponíveis</small><div>${colorList(product.colors || [])}</div><p>Disponibilidade e tonalidades sujeitas à confirmação.</p></div>

                    <div class="product-quote">
                        <div class="product-quote__heading"><div><strong>Solicitar uma cotação</strong><small>Informe uma quantidade estimada.</small></div><label>Quantidade <span class="quantity-control"><button type="button" data-quantity-minus>−</button><input id="quote-quantity" type="number" min="1" value="50"><button type="button" data-quantity-plus>＋</button></span></label></div>
                        <label class="product-quote__note">Observação opcional<textarea id="quote-note" rows="2" placeholder="Ex.: aplicação do logotipo em uma cor..."></textarea></label>
                        <div class="product-quote__actions">
                            <button class="button button--primary" type="button" id="product-whatsapp">Solicitar pelo WhatsApp <span>↗</span></button>
                            <button class="button button--ghost" type="button" id="product-selection">Adicionar à seleção <span>＋</span></button>
                        </div>
                        <p class="product-quote__disclaimer">Este catálogo não realiza vendas online. Valores e prazos são definidos após análise da solicitação.</p>
                    </div>
                </div>
            </div>`;

        document.querySelectorAll("[data-gallery-image]").forEach(button => button.addEventListener("click", () => {
            document.querySelector("#product-main-image").src = button.dataset.galleryImage;
            document.querySelectorAll("[data-gallery-image]").forEach(item => item.classList.remove("is-active"));
            button.classList.add("is-active");
        }));

        const quantityInput = document.querySelector("#quote-quantity");
        document.querySelector("[data-quantity-minus]").addEventListener("click", () => quantityInput.value = Math.max(1, Number(quantityInput.value || 1) - 1));
        document.querySelector("[data-quantity-plus]").addEventListener("click", () => quantityInput.value = Math.max(1, Number(quantityInput.value || 1) + 1));
        quantityInput.addEventListener("change", () => quantityInput.value = Math.max(1, Number(quantityInput.value || 1)));

        document.querySelector("#product-selection").addEventListener("click", () => window.CatalogUI.addToSelection(product.id, quantityInput.value));
        document.querySelector("#product-whatsapp").addEventListener("click", () => {
            const note = document.querySelector("#quote-note").value.trim();
            const message = `Olá! Vim pelo catálogo virtual e gostaria de solicitar uma cotação.\n\nProduto: ${product.name}\nReferência: ${product.code}\nQuantidade estimada: ${quantityInput.value}${note ? `\nObservação: ${note}` : ""}\nLink: ${window.location.href}\n\nGostaria de informações sobre valor, personalização e prazo.`;
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
